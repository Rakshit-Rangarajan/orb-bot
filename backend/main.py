"""
Orb — FastAPI Backend
======================
Embeddings: Ollama (nomic-embed-text, 768-dim) — runs locally, zero API cost.
Vector DB:  Pinecone
AI Chat:    Puter.js on the client — this backend never calls an LLM.
CORS:       Only domains in ALLOWED_ORIGINS may call the API.
"""

import httpx
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pinecone import Pinecone, ServerlessSpec
from pydantic import BaseModel

from config import Settings

# ─────────────────────────────────────────────────────────────
# App
# ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="Orb API",
    description=(
        "RAG backend for Orb. "
        "Embeddings via Ollama (nomic-embed-text), "
        "vector storage via Pinecone, "
        "AI chat via Puter.js (client-side — no LLM here)."
    ),
    version="2.0.0",
)

# ─────────────────────────────────────────────────────────────
# CORS — only configured origins allowed
# ─────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=Settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

# ─────────────────────────────────────────────────────────────
# Pinecone client
# ─────────────────────────────────────────────────────────────
pc = Pinecone(api_key=Settings.PINECONE_API_KEY)


def get_or_create_index():
    existing = [i.name for i in pc.list_indexes()]
    if Settings.PINECONE_INDEX_NAME not in existing:
        pc.create_index(
            name=Settings.PINECONE_INDEX_NAME,
            dimension=Settings.OLLAMA_EMBED_DIM,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region=Settings.PINECONE_ENVIRONMENT),
        )
    return pc.Index(Settings.PINECONE_INDEX_NAME)


index = get_or_create_index()


# ─────────────────────────────────────────────────────────────
# Ollama embedding helper
# ─────────────────────────────────────────────────────────────
def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Call the Ollama /api/embed endpoint for a batch of strings.
    Uses nomic-embed-text (768-dim) by default.
    """
    vectors = []
    with httpx.Client(timeout=60) as client:
        for text in texts:
            resp = client.post(
                f"{Settings.OLLAMA_URL.rstrip('/')}/api/embed",
                json={"model": Settings.OLLAMA_EMBED_MODEL, "input": text},
            )
            resp.raise_for_status()
            data = resp.json()
            # Ollama returns { "embeddings": [[...]] }
            vectors.append(data["embeddings"][0])
    return vectors


def chunk_text(text: str, size: int | None = None, overlap: int | None = None) -> list[str]:
    size    = size    or Settings.CHUNK_SIZE
    overlap = overlap or Settings.CHUNK_OVERLAP
    words   = text.split()
    return [
        " ".join(words[i: i + size])
        for i in range(0, len(words), size - overlap)
        if " ".join(words[i: i + size]).strip()
    ]


# ─────────────────────────────────────────────────────────────
# Request models
# ─────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    namespace: str = "default"
    top_k: int = 4
    min_score: float = 0.55


class IngestRequest(BaseModel):
    namespace: str = "default"
    chunk_size: int = 500
    chunk_overlap: int = 50
    path: str | None = None   # overrides TRAIN_DOX_PATH from .env


class EmbedRequest(BaseModel):
    text: str


# ─────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {
        "status": "Orb API is live",
        "embed_backend": "Ollama",
        "embed_model": Settings.OLLAMA_EMBED_MODEL,
        "embed_dim": Settings.OLLAMA_EMBED_DIM,
        "ollama_url": Settings.OLLAMA_URL,
        "pinecone_index": Settings.PINECONE_INDEX_NAME,
        "allowed_origins": Settings.cors_origins,
    }


@app.post("/embed")
def embed_single(req: EmbedRequest):
    """Return a raw Ollama embedding. Used by /api/embed in Next.js."""
    try:
        return {"embedding": embed_texts([req.text])[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
def chat(req: ChatRequest):
    """
    RAG retrieval:
    1. Embed the user query via Ollama
    2. Query Pinecone for top-k similar chunks
    3. Return assembled context + sources

    The Orb widget receives this context and builds the Puter.js AI prompt.
    """
    try:
        query_vector = embed_texts([req.message])[0]

        results = index.query(
            vector=query_vector,
            top_k=req.top_k,
            namespace=req.namespace,
            include_metadata=True,
        )

        matches = [m for m in results.matches if (m.score or 0) >= req.min_score]

        if not matches:
            return {"context": None, "sources": []}

        context = "\n\n---\n\n".join(
            m.metadata.get("text", "") for m in matches if m.metadata
        )
        sources = list({m.metadata.get("source", "") for m in matches if m.metadata})

        return {"context": context or None, "sources": sources}

    except Exception as e:
        print(f"/chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ingest-directory")
def ingest_directory(req: IngestRequest):
    """
    Chunk, embed (via Ollama), and upsert all .txt/.md/.rst files from a folder.
    """
    path = Path(req.path or Settings.TRAIN_DOX_PATH)
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Path not found: {path}")

    EXTS = {".txt", ".md", ".rst"}
    files = (
        [f for f in path.rglob("*") if f.suffix.lower() in EXTS]
        if path.is_dir() else [path]
    )
    if not files:
        raise HTTPException(status_code=400, detail=f"No .txt/.md/.rst files found in {path}")

    ingested, errors = 0, []

    for file in files:
        try:
            text   = file.read_text(encoding="utf-8")
            chunks = chunk_text(text, req.chunk_size, req.chunk_overlap)
            vecs   = embed_texts(chunks)

            index.upsert(
                vectors=[
                    {
                        "id": f"{file.stem}-{i}",
                        "values": v,
                        "metadata": {"text": chunk, "source": str(file), "chunk_index": i},
                    }
                    for i, (chunk, v) in enumerate(zip(chunks, vecs))
                ],
                namespace=req.namespace,
            )
            ingested += 1
            print(f"  ✓ {file.name} — {len(chunks)} chunks")
        except Exception as e:
            errors.append({"file": str(file), "error": str(e)})
            print(f"  ✗ {file.name}: {e}")

    return {
        "status": "done",
        "files_ingested": ingested,
        "files_failed": len(errors),
        "errors": errors,
        "namespace": req.namespace,
        "index": Settings.PINECONE_INDEX_NAME,
    }


@app.delete("/namespace/{namespace}")
def delete_namespace(namespace: str):
    """Delete all vectors in a namespace (useful before re-ingesting)."""
    try:
        index.delete(delete_all=True, namespace=namespace)
        return {"status": "deleted", "namespace": namespace}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

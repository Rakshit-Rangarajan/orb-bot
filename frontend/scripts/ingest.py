"""
Orb — Pinecone Document Ingestion Script (Ollama embeddings)
=============================================================
Chunks, embeds via Ollama (nomic-embed-text), and upserts to Pinecone.

Requirements:
    pip install pinecone httpx python-dotenv

Environment (.env):
    PINECONE_API_KEY  = your key
    PINECONE_INDEX_NAME = orb-knowledge
    OLLAMA_URL        = http://localhost:11434
    OLLAMA_EMBED_MODEL = nomic-embed-text

Usage:
    python scripts/ingest.py docs/knowledge.txt
    python scripts/ingest.py docs/ --namespace faq
    python scripts/ingest.py manual.md --chunk-size 400 --overlap 60
"""

import os, sys, argparse
from pathlib import Path
import httpx
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

PINECONE_KEY   = os.environ["PINECONE_API_KEY"]
INDEX_NAME     = os.environ.get("PINECONE_INDEX_NAME", "orb-knowledge")
OLLAMA_URL     = os.environ.get("OLLAMA_URL", "http://localhost:11434")
EMBED_MODEL    = os.environ.get("OLLAMA_EMBED_MODEL", "nomic-embed-text")
EMBED_DIM      = 768   # nomic-embed-text output dimension

pc    = Pinecone(api_key=PINECONE_KEY)


def ensure_index():
    existing = [i.name for i in pc.list_indexes()]
    if INDEX_NAME not in existing:
        print(f"Creating index '{INDEX_NAME}' (dim={EMBED_DIM}, cosine)...")
        pc.create_index(
            name=INDEX_NAME, dimension=EMBED_DIM, metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        )
        print("✓ Index created.")
    return pc.Index(INDEX_NAME)


def embed(text: str) -> list[float]:
    """Call Ollama /api/embed and return a single vector."""
    with httpx.Client(timeout=60) as client:
        r = client.post(
            f"{OLLAMA_URL.rstrip('/')}/api/embed",
            json={"model": EMBED_MODEL, "input": text},
        )
        r.raise_for_status()
        return r.json()["embeddings"][0]


def chunk_text(text: str, size: int, overlap: int) -> list[str]:
    words = text.split()
    return [
        " ".join(words[i: i + size])
        for i in range(0, len(words), size - overlap)
        if " ".join(words[i: i + size]).strip()
    ]


def ingest_file(filepath: str, index, namespace: str, chunk_size: int, overlap: int):
    path = Path(filepath)
    if not path.exists():
        print(f"✗ Not found: {filepath}", file=sys.stderr); return

    print(f"\nIngesting: {path.name} → namespace='{namespace}'")
    text   = path.read_text(encoding="utf-8")
    chunks = chunk_text(text, chunk_size, overlap)
    print(f"  {len(chunks)} chunks")

    vectors = []
    for i, chunk in enumerate(chunks):
        vec = embed(chunk)
        vectors.append({
            "id": f"{path.stem}-{i}",
            "values": vec,
            "metadata": {"text": chunk, "source": str(filepath), "chunk_index": i},
        })
        if (i + 1) % 10 == 0:
            print(f"  embedded {i+1}/{len(chunks)}…")

    # Upsert in batches of 100
    for i in range(0, len(vectors), 100):
        index.upsert(vectors=vectors[i:i+100], namespace=namespace)

    print(f"✓ Done — '{path.name}' indexed ({len(chunks)} chunks).")


def ingest_dir(dirpath: str, index, namespace: str, chunk_size: int, overlap: int):
    EXTS = {".txt", ".md", ".rst"}
    files = [f for f in Path(dirpath).rglob("*") if f.suffix.lower() in EXTS]
    if not files:
        print(f"No .txt/.md/.rst files found in {dirpath}"); return
    print(f"Found {len(files)} file(s) in {dirpath}")
    for f in files:
        ingest_file(str(f), index, namespace, chunk_size, overlap)


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Ingest documents into Pinecone via Ollama embeddings")
    ap.add_argument("path")
    ap.add_argument("--namespace",   default="default")
    ap.add_argument("--chunk-size",  type=int, default=500)
    ap.add_argument("--overlap",     type=int, default=50)
    args = ap.parse_args()

    idx    = ensure_index()
    target = Path(args.path)

    if target.is_dir():
        ingest_dir(str(target), idx, args.namespace, args.chunk_size, args.overlap)
    else:
        ingest_file(str(target), idx, args.namespace, args.chunk_size, args.overlap)

    print("\n🔮 Ingestion complete.")

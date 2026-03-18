from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Orb"

    # Pinecone
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    PINECONE_ENVIRONMENT: str = "us-east-1"

    # Ollama (local embeddings — no API key needed)
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"  # 768-dim
    OLLAMA_EMBED_DIM: int = 768

    # Ingestion
    TRAIN_DOX_PATH: str = "./train-docs"
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50

    # CORS allowlist — comma-separated origins
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    model_config = ConfigDict(env_file=".env")

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


Settings = Settings()

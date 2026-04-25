# backend/services/embedder.py
from config import openai_client
from typing import List

EMBED_MODEL = "text-embedding-3-small"

async def embed_text(text: str) -> List[float]:
    response = await openai_client.embeddings.create(model=EMBED_MODEL, input=text)
    return response.data[0].embedding

async def embed_batch(texts: List[str]) -> List[List[float]]:
    if not texts: return []
    response = await openai_client.embeddings.create(model=EMBED_MODEL, input=texts)
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]

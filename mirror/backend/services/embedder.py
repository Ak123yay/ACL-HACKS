# backend/services/embedder.py
from openai import APIConnectionError, APITimeoutError, BadRequestError, AuthenticationError
from config import openai_client
from typing import List

EMBED_MODEL = "text-embedding-3-small"


def _openai_unavailable_message() -> str:
    return (
        "OpenAI is unreachable right now. Check OPENAI_API_KEY, internet access, and any proxy/firewall settings."
    )

async def embed_text(text: str) -> List[float]:
    if openai_client is None:
        raise RuntimeError("OPENAI_API_KEY is not configured.")
    try:
        response = await openai_client.embeddings.create(model=EMBED_MODEL, input=text)
        return response.data[0].embedding
    except (APIConnectionError, APITimeoutError) as exc:
        raise RuntimeError(_openai_unavailable_message()) from exc
    except (AuthenticationError, BadRequestError) as exc:
        raise RuntimeError(f"OpenAI embedding request failed: {exc}") from exc

async def embed_batch(texts: List[str]) -> List[List[float]]:
    if not texts: return []
    if openai_client is None:
        raise RuntimeError("OPENAI_API_KEY is not configured.")
    try:
        response = await openai_client.embeddings.create(model=EMBED_MODEL, input=texts)
        return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]
    except (APIConnectionError, APITimeoutError) as exc:
        raise RuntimeError(_openai_unavailable_message()) from exc
    except (AuthenticationError, BadRequestError) as exc:
        raise RuntimeError(f"OpenAI embedding request failed: {exc}") from exc

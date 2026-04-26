# backend/services/chroma_client.py
import os
import uuid
from typing import Iterable, List, Optional

import chromadb

_client = None
_collection = None


def _get_chroma_path() -> str:
    if os.getenv("CHROMA_PATH"):
        path = os.getenv("CHROMA_PATH")
    elif os.getenv("RAILWAY_ENVIRONMENT"):
        path = "/data/chroma_data"
    else:
        path = "./chroma_data"

    os.makedirs(path, exist_ok=True)
    return path


def _get_collection_name() -> str:
    return os.getenv("CHROMA_COLLECTION_NAME", "mirror_chunks")


def get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=_get_chroma_path())
    return _client


def get_collection():
    global _collection
    if _collection is None:
        _collection = get_client().get_or_create_collection(
            name=_get_collection_name(),
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def add_documents(
    documents: Iterable[str],
    embeddings: Iterable[List[float]],
    metadatas: Iterable[dict],
    ids: Optional[Iterable[str]] = None,
) -> List[str]:
    collection = get_collection()
    document_list = list(documents)
    embedding_list = list(embeddings)
    metadata_list = list(metadatas)
    id_list = list(ids) if ids is not None else [str(uuid.uuid4()) for _ in document_list]

    if not document_list:
        return []

    collection.add(
        ids=id_list,
        documents=document_list,
        embeddings=embedding_list,
        metadatas=metadata_list,
    )
    return id_list


def get_user_chunk_count(user_id: str) -> int:
    collection = get_collection()
    result = collection.get(where={"user_id": user_id}, include=[])
    return len(result.get("ids", []))


def delete_user_chunks(user_id: str):
    collection = get_collection()
    collection.delete(where={"user_id": user_id})
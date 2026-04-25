# backend/services/chroma_client.py
import chromadb

_client = None
_collection = None

def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path="./chroma_data")
        _collection = _client.get_or_create_collection(
            name="mirror_chunks",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection

def get_user_chunk_count(user_id: str) -> int:
    col = get_collection()
    result = col.get(where={"user_id": user_id})
    return len(result["ids"])

def delete_user_chunks(user_id: str):
    col = get_collection()
    col.delete(where={"user_id": user_id})

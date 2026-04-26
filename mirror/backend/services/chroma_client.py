# backend/services/chroma_client.py
from config import get_supabase

def get_user_chunk_count(user_id: str) -> int:
    sb = get_supabase()
    result = sb.table("documents").select("id", count="exact")\
        .eq("metadata->>user_id", user_id).execute()
    return result.count or 0

def delete_user_chunks(user_id: str):
    sb = get_supabase()
    sb.table("documents").delete()\
        .eq("metadata->>user_id", user_id).execute()
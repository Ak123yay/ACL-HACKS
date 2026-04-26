# backend/services/rag.py
from services.embedder import embed_text
from config import get_supabase
from typing import List

async def retrieve_chunks(query, user_id, n_results=5, source_filter=None) -> List[str]:
    query_embedding = await embed_text(query)
    sb = get_supabase()

    result = sb.rpc("match_documents", {
        "query_embedding": query_embedding,
        "match_count": n_results * 2  # fetch extra to filter by user
    }).execute()

    docs = [
        r for r in (result.data or [])
        if r["metadata"].get("user_id") == user_id
        and (source_filter is None or r["metadata"].get("source") == source_filter)
    ]

    # Apply weight boosting for reflection chunks
    docs.sort(key=lambda r: r["similarity"] * r["metadata"].get("weight", 1.0), reverse=True)
    return [r["content"] for r in docs[:n_results]]

async def retrieve_sample_for_persona(user_id: str, sample_size: int = 80) -> List[str]:
    sb = get_supabase()
    result = sb.table("documents")\
        .select("content, metadata")\
        .eq("metadata->>user_id", user_id)\
        .limit(sample_size)\
        .execute()

    if not result.data:
        return []

    # Round-robin across sources for diversity
    by_source = {}
    for row in result.data:
        src = row["metadata"].get("source", "unknown")
        by_source.setdefault(src, []).append(row["content"])

    sample, sources, i = [], list(by_source.keys()), 0
    while len(sample) < sample_size:
        src = sources[i % len(sources)]
        pool = by_source[src]
        if pool: sample.append(pool.pop(0))
        if all(not v for v in by_source.values()): break
        i += 1

    return sample[:sample_size]
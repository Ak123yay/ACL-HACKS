# backend/services/rag.py
from services.embedder import embed_text
from services.chroma_client import get_collection
from typing import List, Dict

async def retrieve_chunks(query, user_id, n_results=5, source_filter=None):
    query_embedding = await embed_text(query)
    col = get_collection()
    where = {"user_id": user_id}
    if source_filter: where["source"] = source_filter
    results = col.query(query_embeddings=[query_embedding], n_results=n_results,
        where=where, include=["documents", "metadatas", "distances"])
    if not results["documents"] or not results["documents"][0]: return []
    docs, metas, dists = results["documents"][0], results["metadatas"][0], results["distances"][0]
    weighted = [(dist / meta.get("weight", 1.0), doc)
                for doc, meta, dist in zip(docs, metas, dists)]
    weighted.sort(key=lambda x: x[0])
    return [doc for _, doc in weighted]

async def retrieve_sample_for_persona(user_id: str, sample_size: int = 80) -> List[str]:
    col = get_collection()
    result = col.get(where={"user_id": user_id}, include=["documents", "metadatas"])
    if not result["documents"]: return []
    by_source: Dict[str, List[str]] = {}
    for doc, meta in zip(result["documents"], result["metadatas"]):
        by_source.setdefault(meta.get("source", "unknown"), []).append(doc)
    sample, sources, i = [], list(by_source.keys()), 0
    while len(sample) < sample_size:
        src = sources[i % len(sources)]
        pool = by_source[src]
        if pool: sample.append(pool.pop(0))
        if all(not v for v in by_source.values()): break
        i += 1
    return sample[:sample_size]

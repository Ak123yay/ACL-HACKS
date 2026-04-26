# backend/services/rag.py
from services.embedder import embed_text
from services.chroma_client import get_collection
from typing import List

async def retrieve_chunks(query, user_id, n_results=5, source_filter=None) -> List[str]:
    query_embedding = await embed_text(query)
    collection = get_collection()

    where = {"user_id": user_id}
    if source_filter:
        where["source"] = source_filter

    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results * 2,
        where=where,
        include=["documents", "metadatas", "distances"],
    )

    documents = result.get("documents", [[]])[0] if result.get("documents") else []
    metadatas = result.get("metadatas", [[]])[0] if result.get("metadatas") else []
    distances = result.get("distances", [[]])[0] if result.get("distances") else []

    weighted = []
    for doc, meta, distance in zip(documents, metadatas, distances):
        weight = meta.get("weight", 1.0) or 1.0
        weighted.append((distance / weight, doc))

    weighted.sort(key=lambda item: item[0])
    return [doc for _, doc in weighted[:n_results]]

async def retrieve_sample_for_persona(user_id: str, sample_size: int = 80) -> List[str]:
    collection = get_collection()
    result = collection.get(where={"user_id": user_id}, include=["documents", "metadatas"])

    if not result.get("documents"):
        return []

    # Round-robin across sources for diversity
    by_source = {}
    for doc, meta in zip(result.get("documents", []), result.get("metadatas", [])):
        src = meta.get("source", "unknown")
        by_source.setdefault(src, []).append(doc)

    sample, sources, i = [], list(by_source.keys()), 0
    while len(sample) < sample_size:
        src = sources[i % len(sources)]
        pool = by_source[src]
        if pool: sample.append(pool.pop(0))
        if all(not v for v in by_source.values()): break
        i += 1

    return sample[:sample_size]
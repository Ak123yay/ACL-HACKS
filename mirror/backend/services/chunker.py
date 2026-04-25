# backend/services/chunker.py
from typing import List

def chunk_messages(messages: List[str], chunk_size: int = 280, overlap: int = 40) -> List[str]:
    if not messages: return []
    corpus = " [SEP] ".join(messages)
    words = corpus.split()
    if len(words) < chunk_size: return [corpus]
    chunks, i = [], 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        if i + chunk_size >= len(words): break
        i += chunk_size - overlap
    return chunks


# backend/services/sentence_detector.py
import re

SENTENCE_END = re.compile(r'[.!?]["\')]*\s*$')

def is_sentence_end(text: str) -> bool:
    if len(text.strip()) < 30: return False
    return bool(SENTENCE_END.search(text.strip()))

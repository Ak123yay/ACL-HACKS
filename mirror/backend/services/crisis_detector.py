# backend/services/crisis_detector.py
from config import anthropic_client
import json

CRISIS_PROMPT = """Analyze for crisis signals (suicidal ideation, self-harm, hopelessness).
Message: {message}
Respond ONLY with JSON: {"is_crisis": boolean, "confidence": float, "signal": "desc or null"}"""

CRISIS_THRESHOLD = 0.72

async def check_for_crisis(message: str) -> dict:
    response = await anthropic_client.messages.create(
        model="claude-haiku-4-5-20251001", max_tokens=100,
        messages=[{"role": "user", "content": CRISIS_PROMPT.format(message=message)}])
    try:
        result = json.loads(response.content[0].text.strip())
    except json.JSONDecodeError:
        return {"is_crisis": False, "confidence": 0.0, "signal": None}
    is_crisis = result.get("is_crisis", False) and result.get("confidence", 0) >= CRISIS_THRESHOLD
    return {**result, "is_crisis": is_crisis}

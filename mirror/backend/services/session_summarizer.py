# backend/services/session_summarizer.py
from config import anthropic_client

SUMMARY_PROMPT = """Below is a therapy-style conversation.
Write a 3-4 sentence journal entry (first person) covering:
1. What they talked through
2. Any shift in perspective
3. One thing to carry forward
Conversation: {conversation}
Sound like how the person actually writes. No therapy jargon."""

async def generate_session_summary(messages: list) -> str:
    conversation = "\n".join([f"{m['role'].upper()}: {m['content']}"
        for m in messages if m["role"] in ("user", "assistant")])
    if not conversation.strip(): return "No conversation recorded."
    response = await anthropic_client.messages.create(
        model="claude-sonnet-4-6", max_tokens=400,
        messages=[{"role": "user", "content": SUMMARY_PROMPT.format(conversation=conversation)}])
    return response.content[0].text

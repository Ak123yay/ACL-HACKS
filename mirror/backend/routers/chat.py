# backend/routers/chat.py
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from models import ChatRequest
from config import anthropic_client
from services.rag import retrieve_chunks
from services.prompt_builder import build_system_prompt
from services.crisis_detector import check_for_crisis
from services.sentence_detector import is_sentence_end
from routers.voice import synthesize_sentence
import base64, json

router = APIRouter()

@router.post("/message")
async def chat_message(req: ChatRequest):
    return EventSourceResponse(generate_response(req), media_type="text/event-stream")

async def generate_response(req: ChatRequest):
    # STEP 1: Crisis Detection (always first)
    crisis = await check_for_crisis(req.message)
    if crisis["is_crisis"]:
        yield {"event": "crisis", "data": json.dumps({
            "signal": crisis.get("signal"),
            "resource": "988 Suicide & Crisis Lifeline: call or text 988",
            "message": "I need to step outside our conversation. Please reach out for help now."})}
        return

    # STEP 2: Get persona (cached in history[0])
    persona = req.history[0].content if req.history and req.history[0].role == "system" else ""

    # STEP 3: RAG Retrieval
    try:
        context_chunks = await retrieve_chunks(query=req.message, user_id=req.user_id, n_results=5)
    except Exception:
        context_chunks = []

    # STEP 4: Build system prompt
    system = build_system_prompt(persona=persona, mode=req.mode,
        context_chunks=context_chunks, intention=req.intention)

    # STEP 5: Build message history
    messages = [{"role": m.role, "content": m.content} for m in req.history
                if m.role in ("user", "assistant")]
    messages.append({"role": "user", "content": req.message})

    # STEP 6: Stream from Claude
    sentence_buffer = ""
    full_response = ""
    try:
        async with anthropic_client.messages.stream(
            model="claude-sonnet-4-6", max_tokens=800,
            system=system, messages=messages[-16:]) as stream:
            async for text_chunk in stream.text_stream:
                full_response += text_chunk
                sentence_buffer += text_chunk
                yield {"event": "text", "data": json.dumps({"token": text_chunk})}
                if is_sentence_end(sentence_buffer) and req.voice_id:
                    audio_bytes = await synthesize_sentence(sentence_buffer.strip(), req.voice_id)
                    if audio_bytes:
                        yield {"event": "audio", "data": json.dumps(
                            {"audio_b64": base64.b64encode(audio_bytes).decode()})}
                    sentence_buffer = ""
        if sentence_buffer.strip() and req.voice_id:
            audio_bytes = await synthesize_sentence(sentence_buffer.strip(), req.voice_id)
            if audio_bytes:
                yield {"event": "audio", "data": json.dumps(
                    {"audio_b64": base64.b64encode(audio_bytes).decode()})}
        yield {"event": "done", "data": json.dumps({"full_response": full_response})}
    except Exception as e:
        yield {"event": "error", "data": json.dumps({"detail": str(e)})}

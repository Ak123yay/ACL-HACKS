# backend/routers/voice.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from openai import APIConnectionError, APITimeoutError, BadRequestError, AuthenticationError
from config import openai_client, get_supabase, SMALLEST_API_KEY
import httpx, tempfile, os

router = APIRouter()
SMALLEST_BASE = "https://waves-api.smallest.ai/api/v1"
SMALLEST_HEADERS = {
    "Authorization": f"Bearer {SMALLEST_API_KEY}",
    "Content-Type": "application/json"
}

@router.post("/clone")
async def clone_voice(
    user_id: str = Form(...),
    user_name: str = Form("Mirror User"),
    audio: UploadFile = File(...)
):
    audio_bytes = await audio.read()

    suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        async with httpx.AsyncClient() as client:
            with open(tmp_path, "rb") as f:
                response = await client.post(
                    f"{SMALLEST_BASE}/lightning-large/add_voice",
                    headers={"Authorization": f"Bearer {SMALLEST_API_KEY}"},
                    data={"displayName": f"Mirror-{user_name}"},
                    files={"file": (audio.filename, f, audio.content_type)},
                    timeout=60.0
                )
    finally:
        os.unlink(tmp_path)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"Smallest.ai error: {response.text}")

    voice_id = response.json()["data"]["voiceId"]

    sb = get_supabase()
    sb.table("profiles").update({"voice_id": voice_id, "onboarding_step": 3})\
        .eq("id", user_id).execute()

    return {"voice_id": voice_id}


@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    if openai_client is None:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured on the backend.")

    audio_bytes = await audio.read()
    suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"

    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        with open(tmp_path, "rb") as f:
            try:
                transcript = await openai_client.audio.transcriptions.create(
                    model="gpt-4o-mini-transcribe", file=f, response_format="text")
            except (APIConnectionError, APITimeoutError):
                raise HTTPException(
                    status_code=503,
                    detail="OpenAI is unreachable. Check network access and OPENAI_API_KEY.",
                )
            except (AuthenticationError, BadRequestError) as exc:
                raise HTTPException(status_code=502, detail=f"OpenAI transcription failed: {exc}")
    finally:
        os.unlink(tmp_path)

    return {"transcript": transcript}


async def synthesize_sentence(sentence: str, voice_id: str) -> bytes:
    payload = {
        "text": sentence,
        "voice_id": voice_id,
        "sample_rate": 24000,
        "add_wav_header": True
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SMALLEST_BASE}/lightning/get_speech",
            headers=SMALLEST_HEADERS,
            json=payload,
            timeout=15.0
        )
    if response.status_code != 200:
        return b""
    return response.content
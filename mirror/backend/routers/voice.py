# backend/routers/voice.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from config import openai_client, get_supabase, ELEVENLABS_API_KEY
import httpx, tempfile, os

router = APIRouter()
EL_BASE = "https://api.elevenlabs.io/v1"
EL_HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

@router.post("/clone")
async def clone_voice(user_id: str = Form(...),
    user_name: str = Form("Mirror User"), audio: UploadFile = File(...)):
    audio_bytes = await audio.read()
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{EL_BASE}/voices/add",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            data={"name": f"Mirror-{user_name}"},
            files={"files": (audio.filename, audio_bytes, audio.content_type)},
            timeout=60.0)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail=f"ElevenLabs error: {response.text}")
    voice_id = response.json()["voice_id"]
    sb = get_supabase()
    sb.table("profiles").update({"voice_id": voice_id, "onboarding_step": 3})\
        .eq("id", user_id).execute()
    return {"voice_id": voice_id}

@router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()
    suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    try:
        with open(tmp_path, "rb") as f:
            transcript = await openai_client.audio.transcriptions.create(
                model="whisper-1", file=f, response_format="text")
    finally:
        os.unlink(tmp_path)
    return {"transcript": transcript}

async def synthesize_sentence(sentence: str, voice_id: str) -> bytes:
    payload = {"text": sentence, "model_id": "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.85}}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{EL_BASE}/text-to-speech/{voice_id}",
            headers=EL_HEADERS, json=payload, timeout=15.0)
    if response.status_code != 200: return b""
    return response.content

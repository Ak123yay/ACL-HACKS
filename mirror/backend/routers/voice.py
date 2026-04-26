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
    if not SMALLEST_API_KEY:
        raise HTTPException(status_code=503, detail="SMALLEST_API_KEY is not configured on the backend.")

    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Uploaded audio sample is empty.")

    suffix = os.path.splitext(audio.filename or "audio.webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        async with httpx.AsyncClient() as client:
            with open(tmp_path, "rb") as f:
                try:
                    response = await client.post(
                        f"{SMALLEST_BASE}/lightning-large/add_voice",
                        headers={"Authorization": f"Bearer {SMALLEST_API_KEY}"},
                        data={"displayName": f"Mirror-{user_name}"},
                        files={"file": (audio.filename, f, audio.content_type)},
                        timeout=httpx.Timeout(180.0, connect=20.0, read=180.0, write=30.0),
                    )
                except httpx.TimeoutException:
                    raise HTTPException(
                        status_code=504,
                        detail="Voice cloning timed out while waiting for the voice provider.",
                    )
                except httpx.RequestError as exc:
                    raise HTTPException(
                        status_code=502,
                        detail=f"Voice provider request failed: {exc.__class__.__name__}",
                    )
    finally:
        os.unlink(tmp_path)

    if response.status_code != 200:
        print("SMALLEST STATUS:", response.status_code)
        print("SMALLEST RESPONSE:", response.text)
        raise HTTPException(
            status_code=502,
            detail=f"Voice provider error ({response.status_code}): {response.text[:300]}",
        )

    try:
        voice_id = response.json()["data"]["voiceId"]
    except (ValueError, KeyError, TypeError):
        raise HTTPException(status_code=502, detail="Voice provider returned an invalid response.")

    try:
        sb = get_supabase()
        print("VOICE ID:", voice_id)
        print("USER ID:", user_id)
        result = sb.table("profiles").update({"voice_id": voice_id, "onboarding_step": 3})\
            .eq("id", user_id).execute()
        print("SUPABASE RESULT:", result)
    except RuntimeError as exc:
        print("SUPABASE RUNTIME ERROR:", exc)
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        print("SUPABASE ERROR:", exc)
        raise HTTPException(status_code=502, detail="Failed to persist voice clone in profile.")
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
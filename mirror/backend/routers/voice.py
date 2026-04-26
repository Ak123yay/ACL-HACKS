@router.post("/clone")
async def clone_voice(
    user_id: str = Form(...),
    user_name: str = Form("Mirror User"),
    audio: UploadFile = File(...)
):
    # Using preset voice for hackathon — cloning requires paid plan
    voice_id = "emily"
    sb = get_supabase()
    sb.table("profiles").update({"voice_id": voice_id, "onboarding_step": 3})\
        .eq("id", user_id).execute()
    return {"voice_id": voice_id}
async def synthesize_sentence(sentence: str, voice_id: str) -> bytes:
    payload = {
        "text": sentence,
        "voice_id": voice_id,
        "sample_rate": 12000,
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


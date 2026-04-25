# backend/routers/persona.py
from fastapi import APIRouter, HTTPException
from models import PersonaGenerateRequest
from services.persona_generator import generate_persona
from config import get_supabase

router = APIRouter()

@router.post("/generate")
async def generate_persona_endpoint(req: PersonaGenerateRequest):
    sb = get_supabase()
    profile = sb.table("profiles").select("display_name").eq("id", req.user_id).single().execute()
    name = profile.data.get("display_name", "you") if profile.data else "you"
    try:
        persona = await generate_persona(req.user_id, name)
        return {"persona_prompt": persona, "word_count": len(persona.split())}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
async def get_persona(user_id: str):
    sb = get_supabase()
    result = sb.table("profiles").select("persona_prompt, voice_id").eq("id", user_id).single().execute()
    return result.data

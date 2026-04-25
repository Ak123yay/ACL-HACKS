# backend/routers/session.py
from fastapi import APIRouter
from models import StartSessionRequest, EndSessionRequest
from config import get_supabase
from services.session_summarizer import generate_session_summary
import json

router = APIRouter()

@router.post("/start")
async def start_session(req: StartSessionRequest):
    sb = get_supabase()
    result = sb.table("sessions").insert({"user_id": req.user_id, "mode": req.mode,
        "intention": req.intention, "mood_before": req.mood_before}).execute()
    session_id = result.data[0]["id"]
    sb.table("mood_logs").insert({"user_id": req.user_id, "session_id": session_id,
        "score": req.mood_before, "type": "before"}).execute()
    return {"session_id": session_id}

@router.post("/end")
async def end_session(req: EndSessionRequest):
    sb = get_supabase()
    messages_dicts = [{"role": m.role, "content": m.content} for m in req.messages]
    summary = await generate_session_summary(messages_dicts)
    sb.table("sessions").update({"mood_after": req.mood_after,
        "messages": json.dumps(messages_dicts), "summary": summary,
        "ended_at": "now()"}).eq("id", req.session_id).execute()
    sb.table("mood_logs").insert({"user_id": req.user_id,
        "session_id": req.session_id, "score": req.mood_after, "type": "after"}).execute()
    return {"summary": summary, "session_id": req.session_id}

@router.get("/list")
async def list_sessions(user_id: str, limit: int = 20):
    sb = get_supabase()
    result = sb.table("sessions").select(
        "id, mode, intention, mood_before, mood_after, summary, started_at, ended_at"
    ).eq("user_id", user_id).order("started_at", desc=True).limit(limit).execute()
    return result.data

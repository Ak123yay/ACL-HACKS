# backend/routers/insights.py
from fastapi import APIRouter
from config import get_supabase

router = APIRouter()

@router.get("/mood")
async def mood_over_time(user_id: str):
    sb = get_supabase()
    result = sb.table("mood_logs").select("score, type, recorded_at")\
        .eq("user_id", user_id).order("recorded_at").execute()
    return result.data

@router.get("/stats")
async def usage_stats(user_id: str):
    sb = get_supabase()
    sessions = sb.table("sessions").select("mode, mood_before, mood_after")\
        .eq("user_id", user_id).not_.is_("ended_at", "null").execute()
    data = sessions.data or []
    by_mode, total_improvement, counted = {}, 0, 0
    for s in data:
        by_mode[s["mode"]] = by_mode.get(s["mode"], 0) + 1
        if s["mood_before"] and s["mood_after"]:
            total_improvement += s["mood_after"] - s["mood_before"]
            counted += 1
    return {"total_sessions": len(data), "by_mode": by_mode,
            "avg_mood_improvement": round(total_improvement / counted, 2) if counted else 0}

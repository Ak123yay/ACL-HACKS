# backend/routers/ingest.py
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from postgrest.exceptions import APIError
from config import get_supabase
from services.parsers import parse_file
from services.chunker import chunk_messages
from services.embedder import embed_batch
from models import ReflectionRequest
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(background_tasks: BackgroundTasks,
    file: UploadFile = File(...), user_id: str = Form(...),
    source: str = Form(...), user_name: str = Form("")):
    try:
        try:
            uuid.UUID(user_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid user_id (must be UUID)")

        job_id = str(uuid.uuid4())
        try:
            content = await file.read()
            file_text = content.decode("utf-8", errors="ignore")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {exc}") from exc

        try:
            sb = get_supabase()
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Supabase client initialization failed: {exc}",
            ) from exc

        try:
            sb.table("ingest_jobs").insert({"id": job_id, "user_id": user_id,
                "source": source, "status": "processing"}).execute()
        except APIError as exc:
            raise HTTPException(
                status_code=500,
                detail=(
                    "Backend cannot write to Supabase ingest_jobs. "
                    "Confirm SUPABASE_SERVICE_ROLE_KEY is set and grant table privileges in Supabase SQL Editor."
                ),
            ) from exc

        background_tasks.add_task(run_ingestion, job_id, user_id, file_text, source, user_name)
        return {"job_id": job_id, "status": "processing"}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unhandled ingest upload error: {exc}") from exc


async def run_ingestion(job_id, user_id, file_text, source, user_name):
    try:
        sb = get_supabase()
        messages = parse_file(file_text, source, user_name)
        if not messages:
            raise ValueError("No messages found in file")

        chunks = chunk_messages(messages)
        embeddings = await embed_batch(chunks)

        rows = [
            {
                "content": chunk,
                "embedding": embedding,
                "metadata": {
                    "user_id": user_id,
                    "source": source,
                    "weight": 2.0 if source == "reflection" else 1.0
                }
            }
            for chunk, embedding in zip(chunks, embeddings)
        ]
        sb.table("documents").insert(rows).execute()

        sb.table("ingest_jobs").update({"status": "complete",
            "chunks_added": len(chunks), "completed_at": "now()"}).eq("id", job_id).execute()
        sb.table("profiles").update({"onboarding_step": 1}).eq("id", user_id).execute()

    except Exception as e:
        import traceback
        print("INGEST ERROR:", e)
        traceback.print_exc()
        try:
            sb.table("ingest_jobs").update({
                "status": "error",
                "error": str(e)
            }).eq("id", job_id).execute()
        except Exception as update_exc:
            print("INGEST STATUS UPDATE ERROR:", update_exc)


@router.get("/status/{job_id}")
async def ingest_status(job_id: str):
    sb = get_supabase()
    result = sb.table("ingest_jobs").select("*").eq("id", job_id).single().execute()
    return result.data


@router.post("/questions")
async def save_reflections(req: ReflectionRequest):
    sb = get_supabase()
    rows_db = [{"user_id": req.user_id,
                "question_id": a.question_id,
                "answer": a.answer} for a in req.answers]
    sb.table("reflections").insert(rows_db).execute()

    from services.embedder import embed_batch
    texts = [a.answer for a in req.answers]
    embeddings = await embed_batch(texts)

    rows = [
        {
            "content": text,
            "embedding": embedding,
            "metadata": {
                "user_id": req.user_id,
                "source": "reflection",
                "weight": 2.0
            }
        }
        for text, embedding in zip(texts, embeddings)
    ]
    sb.table("documents").insert(rows).execute()

    sb.table("profiles").update({"onboarding_step": 2})\
        .eq("id", req.user_id).execute()
    return {"saved": True}
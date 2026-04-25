# backend/routers/ingest.py
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks
from config import get_supabase
from services.parsers import parse_file
from services.chunker import chunk_messages
from services.embedder import embed_batch
from services.chroma_client import get_collection
from models import ReflectionRequest
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(background_tasks: BackgroundTasks,
    file: UploadFile = File(...), user_id: str = Form(...),
    source: str = Form(...), user_name: str = Form("")):
    job_id = str(uuid.uuid4())
    content = await file.read()
    file_text = content.decode("utf-8", errors="ignore")
    sb = get_supabase()
    sb.table("ingest_jobs").insert({"id": job_id, "user_id": user_id,
        "source": source, "status": "processing"}).execute()
    background_tasks.add_task(run_ingestion, job_id, user_id, file_text, source, user_name)
    return {"job_id": job_id, "status": "processing"}

async def run_ingestion(job_id, user_id, file_text, source, user_name):
    sb = get_supabase()
    try:
        messages = parse_file(file_text, source, user_name)
        if not messages: raise ValueError("No messages found in file")
        chunks = chunk_messages(messages)
        embeddings = await embed_batch(chunks)
        col = get_collection()
        ids = [f"{user_id}_{source}_{i}" for i in range(len(chunks))]
        metas = [{"user_id": user_id, "source": source,
                  "weight": 2.0 if source == "reflection" else 1.0} for _ in chunks]
        col.upsert(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metas)
        sb.table("ingest_jobs").update({"status": "complete",
            "chunks_added": len(chunks), "completed_at": "now()"}).eq("id", job_id).execute()
        sb.table("profiles").update({"onboarding_step": 1}).eq("id", user_id).execute()
    except Exception as e:
        sb.table("ingest_jobs").update({"status": "error", "error": str(e)}).eq("id", job_id).execute()

@router.get("/status/{job_id}")
async def ingest_status(job_id: str):
    sb = get_supabase()
    result = sb.table("ingest_jobs").select("*").eq("id", job_id).single().execute()
    return result.data

# backend/routers/ingest.py
from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from services.parsers import parse_file
from services.chunker import chunk_messages
from services.embedder import embed_batch
from services.chroma_client import add_documents
from models import ReflectionRequest
from datetime import datetime, timezone
from threading import Lock
import uuid

router = APIRouter()

INGEST_JOBS = {}
INGEST_JOBS_LOCK = Lock()


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _set_job(job_id: str, fields: dict):
    with INGEST_JOBS_LOCK:
        existing = INGEST_JOBS.get(job_id, {})
        existing.update(fields)
        existing["updated_at"] = _now_iso()
        INGEST_JOBS[job_id] = existing


def _get_job(job_id: str):
    with INGEST_JOBS_LOCK:
        return INGEST_JOBS.get(job_id)

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

        _set_job(job_id, {
            "id": job_id,
            "user_id": user_id,
            "source": source,
            "status": "processing",
            "chunks_added": 0,
            "error": None,
            "created_at": _now_iso(),
            "completed_at": None,
        })

        background_tasks.add_task(run_ingestion, job_id, user_id, file_text, source, user_name)
        return {"job_id": job_id, "status": "processing"}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unhandled ingest upload error: {exc}") from exc


async def run_ingestion(job_id, user_id, file_text, source, user_name):
    try:
        messages = parse_file(file_text, source, user_name)
        if not messages:
            raise ValueError("No messages found in file")

        chunks = chunk_messages(messages)
        embeddings = await embed_batch(chunks)

        metadatas = [
            {
                "user_id": user_id,
                "source": source,
                "weight": 2.0 if source == "reflection" else 1.0,
            }
            for _ in chunks
        ]
        add_documents(
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas,
        )

        _set_job(job_id, {
            "status": "complete",
            "chunks_added": len(chunks),
            "error": None,
            "completed_at": _now_iso(),
        })

    except Exception as e:
        import traceback
        print("INGEST ERROR:", e)
        traceback.print_exc()
        _set_job(job_id, {
            "status": "error",
            "error": str(e),
            "completed_at": _now_iso(),
        })


@router.get("/status/{job_id}")
async def ingest_status(job_id: str):
    job = _get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Ingest job not found")
    return job


@router.post("/questions")
async def save_reflections(req: ReflectionRequest):
    from services.embedder import embed_batch
    texts = [a.answer for a in req.answers]
    embeddings = await embed_batch(texts)

    metadatas = [
        {
            "user_id": req.user_id,
            "source": "reflection",
            "weight": 2.0,
        }
        for _ in texts
    ]
    add_documents(
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )
    return {"saved": True, "chunks_added": len(texts)}
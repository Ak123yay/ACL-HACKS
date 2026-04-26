# backend/main.py

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL
from routers import ingest, persona, chat, voice, session, insights

app = FastAPI(title="Mirror API", version="1.0.0")

frontend_origins = {"http://localhost:5173", "https://acl-hacks.vercel.app"}
if FRONTEND_URL:
    frontend_origins.add(FRONTEND_URL.rstrip("/"))

extra_origins = os.getenv("FRONTEND_URLS", "")
for origin in [o.strip().rstrip("/") for o in extra_origins.split(",") if o.strip()]:
    frontend_origins.add(origin)

app.add_middleware(CORSMiddleware,
    allow_origins=sorted(frontend_origins),
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(ingest.router,   prefix="/ingest",   tags=["Ingestion"])
app.include_router(persona.router,  prefix="/persona",  tags=["Persona"])
app.include_router(chat.router,     prefix="/chat",     tags=["Chat"])
app.include_router(voice.router,    prefix="/voice",    tags=["Voice"])
app.include_router(session.router,  prefix="/session",  tags=["Sessions"])
app.include_router(insights.router, prefix="/insights", tags=["Insights"])

@app.get("/health")
def health(): return {"status": "ok", "service": "Mirror API"}

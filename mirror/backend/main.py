# backend/main.py (temporary test version)
from fastapi import FastAPI
app = FastAPI()
@app.get("/health")

def health(): return {"status": "ok"}

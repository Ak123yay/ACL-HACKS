**MIRROR**

**Full Technical Implementation Guide**

_Every file. Every command. Every line of code._

**10 Steps from Zero to Deployed**

Hackathon Build Edition | April 2026

# **How to Use This Guide**

This document is a pure implementation guide. It assumes you have already read the Mirror Business Plan and understand what you are building. Every step in this guide contains:

- The exact terminal commands to run, in order
- The complete code for every file - copy, paste, done
- What to verify before moving to the next step
- Common errors and how to fix them

| **NOTE** | Work through steps in order. Each step depends on the previous. Do not skip ahead. |
| -------- | ---------------------------------------------------------------------------------- |

## **Tech Stack Summary**

| **Layer**       | **Technology**                | **Why**                                           |
| --------------- | ----------------------------- | ------------------------------------------------- |
| **Frontend**    | React 18 + Vite + Tailwind    | Fast dev server, no SSR complexity, great for SPA |
| **Backend**     | FastAPI (Python 3.11)         | Async-first, built-in OpenAPI docs, SSE support   |
| **Database**    | Supabase (Postgres + Auth)    | Free tier, built-in auth, easy SDK                |
| **Vector DB**   | ChromaDB (embedded)           | Free, runs in-process, zero infrastructure        |
| **LLM**         | Claude API (Sonnet 4 + Haiku) | Best quality/cost, streaming support              |
| **Embeddings**  | OpenAI text-embedding-3-small | 1536 dimensions, cheapest, fast                   |
| **Voice Clone** | ElevenLabs                    | Best quality voice cloning API available          |
| **STT**         | OpenAI Whisper                | Most accurate speech-to-text available            |
| **Deploy (FE)** | Vercel                        | Zero-config Vite deploy, free tier                |
| **Deploy (BE)** | Railway                       | Simplest Python deploy, free \$5 credit           |

## **Accounts You Need Before Starting**

- anthropic.com - Create account, go to console.anthropic.com, generate API key
- platform.openai.com - Create account, generate API key (for Whisper + embeddings)
- elevenlabs.io - Create account, generate API key. Creator plan (\$22/mo) needed for voice cloning
- supabase.com - Create account, create new project, copy URL and anon key
- railway.app - Sign up with GitHub
- vercel.com - Sign up with GitHub

| **WARNING** | Do not start coding until all 6 accounts are created and all API keys are in hand. You will need them in Step 1. |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**1** | **Project Setup & Scaffolding**<br><br>_Creating the repo structure, installing all dependencies, and verifying the dev environment_ |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |

## **1.1 - Create Root Directory**

Open your terminal. Navigate to where you keep code projects. Run:

mkdir mirror

cd mirror

git init

echo "node_modules/" > .gitignore

echo "\__pycache_\_/" >> .gitignore

echo "venv/" >> .gitignore

echo ".env" >> .gitignore

echo "chroma_data/" >> .gitignore

## **1.2 - Bootstrap the Frontend**

From inside the mirror/ directory:

npm create vite@latest frontend -- --template react

cd frontend

npm install

Now install all frontend dependencies in one command:

npm install react-router-dom axios recharts

npm install -D tailwindcss @tailwindcss/vite

### **1.2.1 - Configure Tailwind**

Create tailwind.config.js in the frontend/ folder:

// frontend/tailwind.config.js

/\*\* @type {import("tailwindcss").Config} \*/

export default {

content: \["./index.html", "./src/\*\*/\*.{js,jsx,ts,tsx}"\],

theme: {

extend: {

colors: {

mirror: {

50: '#F5F3FF',

100: '#EDE9FF',

200: '#C4B5FD',

500: '#6B46C1',

700: '#4C1D95',

900: '#2E1065',

}

},

fontFamily: { sans: \['Inter', 'sans-serif'\] },

},

},

plugins: \[\],

}

Replace the contents of src/index.css with:

/\* frontend/src/index.css \*/

@import url("<https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap>");

@tailwind base;

@tailwind components;

@tailwind utilities;

### **1.2.2 - Configure Vite**

Replace the contents of vite.config.js:

// frontend/vite.config.js

import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

plugins: \[react(), tailwindcss()\],

server: {

proxy: {

'/api': {

target: '<http://localhost:8000>',

changeOrigin: true,

rewrite: (path) => path.replace(/^\\/api/, ''),

},

},

},

})

| **NOTE** | The proxy config means all /api/\* calls from React automatically go to your FastAPI backend on port 8000. No CORS issues in development. |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |

## **1.3 - Bootstrap the Backend**

Navigate back to the root mirror/ directory:

cd ..

mkdir backend

cd backend

python -m venv venv

Activate the virtual environment:

source venv/bin/activate # Mac / Linux

venv\\Scripts\\activate # Windows

Install all Python dependencies:

pip install fastapi uvicorn python-dotenv

pip install anthropic openai

pip install elevenlabs

pip install chromadb

pip install supabase

pip install python-multipart

pip install sse-starlette

pip install httpx aiofiles

Create requirements.txt:

pip freeze > requirements.txt

## **1.4 - Create Environment Variables File**

Inside backend/, create a file named .env (this file is gitignored):

\# backend/.env

ANTHROPIC_API_KEY=sk-ant-api03-...

OPENAI_API_KEY=sk-proj-...

ELEVENLABS*API_KEY=sk*...

SUPABASE_URL=<https://xxxxxxxxxxxxx.supabase.co>

SUPABASE_KEY=eyJhbGciOiJ...

FRONTEND_URL=<http://localhost:5173>

| **WARNING** | Never commit your .env file. Verify it is in .gitignore before running git add. |
| ----------- | ------------------------------------------------------------------------------- |

## **1.5 - Create the Backend Folder Structure**

From inside backend/, create all the directories and empty files:

mkdir -p routers services

touch main.py config.py models.py

touch routers/\__init_\_.py routers/ingest.py routers/persona.py

touch routers/chat.py routers/voice.py routers/session.py

touch routers/journal.py routers/insights.py

touch services/\__init_\_.py services/parsers.py services/chunker.py

touch services/embedder.py services/chroma_client.py services/rag.py

touch services/persona_generator.py services/crisis_detector.py

touch services/session_summarizer.py services/prompt_builder.py

## **1.6 - Create the Frontend Folder Structure**

From inside frontend/src/, run:

mkdir -p pages/onboarding components hooks context api

touch pages/Landing.jsx pages/Auth.jsx pages/Home.jsx

touch pages/Session.jsx pages/Journal.jsx pages/Insights.jsx pages/Settings.jsx

touch pages/onboarding/OnboardLayout.jsx pages/onboarding/Step1Import.jsx

touch pages/onboarding/Step2Voice.jsx pages/onboarding/Step3Reflect.jsx

touch pages/onboarding/Step4Generating.jsx

touch components/VoiceButton.jsx components/ChatBubble.jsx

touch components/ModeSelector.jsx components/MoodSlider.jsx

touch components/IntentionInput.jsx components/CrisisOverlay.jsx

touch components/MoodChart.jsx components/SessionCard.jsx

touch hooks/useVoiceInput.js hooks/useAudioPlayer.js hooks/useSSE.js

touch context/AuthContext.jsx context/CloneContext.jsx

touch api/client.js

## **1.7 - Verify Everything Works**

Open two terminal windows. In terminal 1 (frontend):

cd mirror/frontend

npm run dev

You should see: Local: <http://localhost:5173>

In terminal 2 (backend) - first write a minimal main.py:

\# backend/main.py (temporary test version)

from fastapi import FastAPI

app = FastAPI()

@app.get("/health")

def health(): return {"status": "ok"}

uvicorn main:app --reload --port 8000

Visit <http://localhost:8000/health> in your browser. You should see {"status":"ok"}. Visit <http://localhost:8000/docs> to see the auto-generated API docs.

| **CHECK** | Both servers running? Frontend on 5173, backend on 8000, /health returns ok? Move to Step 2. |
| --------- | -------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**2** | **Supabase Database Setup**<br><br>_Creating all tables, configuring auth, and writing the config/models files_ |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |

## **2.1 - Create Tables in Supabase**

Go to supabase.com -> your project -> SQL Editor. Run each block below one at a time.

### **2.1.1 - Users Extension Table**

Supabase auto-creates the core auth.users table. We add a profiles table for Mirror-specific data:

CREATE TABLE public.profiles (

id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

display_name TEXT,

voice_id TEXT,

persona_prompt TEXT,

onboarding_step INTEGER DEFAULT 0,

mode_preference TEXT DEFAULT 'vent',

created_at TIMESTAMPTZ DEFAULT NOW()

);

\-- Auto-create profile when user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()

RETURNS TRIGGER AS \$\$

BEGIN

INSERT INTO public.profiles (id, display_name)

VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');

RETURN NEW;

END;

\$\$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created

AFTER INSERT ON auth.users

FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

### **2.1.2 - Sessions Table**

CREATE TABLE public.sessions (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

mode TEXT NOT NULL CHECK (mode IN ('vent','reframe','boost')),

intention TEXT,

mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 5),

mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 5),

messages JSONB DEFAULT '\[\]',

summary TEXT,

started_at TIMESTAMPTZ DEFAULT NOW(),

ended_at TIMESTAMPTZ

);

### **2.1.3 - Mood Logs Table**

CREATE TABLE public.mood_logs (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,

score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),

type TEXT NOT NULL CHECK (type IN ('before','after')),

recorded_at TIMESTAMPTZ DEFAULT NOW()

);

### **2.1.4 - Reflection Answers Table**

CREATE TABLE public.reflections (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

question_id INTEGER NOT NULL,

answer TEXT NOT NULL,

created_at TIMESTAMPTZ DEFAULT NOW()

);

### **2.1.5 - Ingest Jobs Table**

CREATE TABLE public.ingest_jobs (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

source TEXT NOT NULL,

status TEXT DEFAULT 'pending',

chunks_added INTEGER DEFAULT 0,

error TEXT,

created_at TIMESTAMPTZ DEFAULT NOW(),

completed_at TIMESTAMPTZ

);

## **2.2 - Enable Row Level Security**

In Supabase SQL Editor, enable RLS so users can only see their own data:

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ingest_jobs ENABLE ROW LEVEL SECURITY;

\-- Profiles: users see only their own row

CREATE POLICY "Own profile" ON public.profiles

FOR ALL USING (auth.uid() = id);

\-- Sessions: users see only their own sessions

CREATE POLICY "Own sessions" ON public.sessions

FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own mood_logs" ON public.mood_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own reflections" ON public.reflections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own ingest_jobs" ON public.ingest_jobs FOR ALL USING (auth.uid() = user_id);

## **2.3 - Write config.py**

This file loads all environment variables and creates singleton clients:

\# backend/config.py

import os

from dotenv import load_dotenv

from anthropic import AsyncAnthropic

from openai import AsyncOpenAI

from supabase import create_client, Client

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")

SUPABASE_KEY = os.getenv("SUPABASE_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL", "<http://localhost:5173>")

\# AI clients

anthropic_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)

openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

\# Supabase client

def get_supabase() -> Client:

return create_client(SUPABASE_URL, SUPABASE_KEY)

## **2.4 - Write models.py**

Pydantic schemas for all request/response bodies:

\# backend/models.py

from pydantic import BaseModel

from typing import Optional, List

class Message(BaseModel):

role: str # "user" or "assistant"

content: str

class ChatRequest(BaseModel):

user_id: str

session_id: str

message: str

mode: str # vent | reframe | boost

intention: str

history: List\[Message\]

voice_id: Optional\[str\] = None

class StartSessionRequest(BaseModel):

user_id: str

mode: str

intention: str

mood_before: int

class EndSessionRequest(BaseModel):

session_id: str

user_id: str

messages: List\[Message\]

mood_after: int

class ReflectionAnswer(BaseModel):

question_id: int

answer: str

class ReflectionRequest(BaseModel):

user_id: str

answers: List\[ReflectionAnswer\]

class PersonaGenerateRequest(BaseModel):

user_id: str

| **CHECK** | Run: python -c "from config import anthropic_client; print('OK')" -- should print OK with no errors. |
| --------- | ---------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**3** | **Data Ingestion Pipeline**<br><br>_Parsers for WhatsApp, ChatGPT, and Claude exports; chunking; embedding; ChromaDB storage_ |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |

## **3.1 - ChromaDB Client (services/chroma_client.py)**

ChromaDB runs embedded - no Docker, no server. It persists data to a local directory:

\# backend/services/chroma_client.py

import chromadb

\_client = None

\_collection = None

def get_collection():

global \_client, \_collection

if \_collection is None:

\_client = chromadb.PersistentClient(path="./chroma_data")

\_collection = \_client.get_or_create_collection(

name="mirror_chunks",

metadata={"hnsw:space": "cosine"}

)

return \_collection

def get_user_chunk_count(user_id: str) -> int:

col = get_collection()

result = col.get(where={"user_id": user_id})

return len(result\["ids"\])

def delete_user_chunks(user_id: str):

col = get_collection()

col.delete(where={"user_id": user_id})

## **3.2 - Source Parsers (services/parsers.py)**

Three separate parsers, one for each data source:

\# backend/services/parsers.py

import re, json

from typing import List

WHATSAPP_PATTERN = re.compile(

r"^\\d{1,2}/\\d{1,2}/\\d{2,4},\\s\\d{1,2}:\\d{2}(?:\\s?\[AP\]M)?\\s-\\s(.+?):\\s(.+)\$"

)

def parse_whatsapp(file_text: str, user_name: str) -> List\[str\]:

messages = \[\]

for line in file_text.splitlines():

m = WHATSAPP_PATTERN.match(line.strip())

if not m: continue

sender, text = m.group(1).strip(), m.group(2).strip()

if sender.lower() != user_name.lower(): continue

if text in ("&lt;Media omitted&gt;", "image omitted"): continue

if len(text) < 15: continue

messages.append(text)

return messages

def parse_chatgpt(file_text: str) -> List\[str\]:

try: data = json.loads(file_text)

except json.JSONDecodeError: return \[\]

messages = \[\]

for conversation in data:

for node in conversation.get("mapping", {}).values():

msg = node.get("message")

if not msg: continue

if msg.get("author", {}).get("role") != "user": continue

for part in msg.get("content", {}).get("parts", \[\]):

if isinstance(part, str) and len(part.strip()) > 30:

messages.append(part.strip())

return messages

def parse_claude_export(file_text: str) -> List\[str\]:

try: data = json.loads(file_text)

except json.JSONDecodeError: return \[\]

messages = \[\]

for conversation in data:

for msg in conversation.get("chat_messages", \[\]):

if msg.get("sender") != "human": continue

content = msg.get("text", "") or msg.get("content", "")

if isinstance(content, list):

for block in content:

if isinstance(block, dict) and block.get("type") == "text":

t = block.get("text", "")

if len(t.strip()) > 30: messages.append(t.strip())

elif isinstance(content, str) and len(content.strip()) > 30:

messages.append(content.strip())

return messages

def parse_file(file_text: str, source: str, user_name: str = "") -> List\[str\]:

if source == "whatsapp": return parse_whatsapp(file_text, user_name)

elif source == "chatgpt": return parse_chatgpt(file_text)

elif source == "claude": return parse_claude_export(file_text)

else: return \[ln.strip() for ln in file_text.splitlines() if len(ln.strip()) > 20\]

## **3.3 - Chunker (services/chunker.py)**

\# backend/services/chunker.py

from typing import List

def chunk_messages(messages: List\[str\], chunk_size: int = 280, overlap: int = 40) -> List\[str\]:

if not messages: return \[\]

corpus = " \[SEP\] ".join(messages)

words = corpus.split()

if len(words) < chunk_size: return \[corpus\]

chunks, i = \[\], 0

while i < len(words):

chunk = " ".join(words\[i:i + chunk_size\])

chunks.append(chunk)

if i + chunk_size >= len(words): break

i += chunk_size - overlap

return chunks

## **3.4 - Embedder (services/embedder.py)**

\# backend/services/embedder.py

from config import openai_client

from typing import List

EMBED_MODEL = "text-embedding-3-small"

async def embed_text(text: str) -> List\[float\]:

response = await openai_client.embeddings.create(model=EMBED_MODEL, input=text)

return response.data\[0\].embedding

async def embed_batch(texts: List\[str\]) -> List\[List\[float\]\]:

if not texts: return \[\]

response = await openai_client.embeddings.create(model=EMBED_MODEL, input=texts)

return \[item.embedding for item in sorted(response.data, key=lambda x: x.index)\]

## **3.5 - Ingest Router (routers/ingest.py)**

\# backend/routers/ingest.py

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

ids = \[f"{user_id}\_{source}\_{i}" for i in range(len(chunks))\]

metas = \[{"user_id": user_id, "source": source,

"weight": 2.0 if source == "reflection" else 1.0} for \_ in chunks\]

col.upsert(ids=ids, embeddings=embeddings, documents=chunks, metadatas=metas)

sb.table("ingest_jobs").update({"status": "complete",

"chunks_added": len(chunks), "completed_at": "now()"}).eq("id", job_id).execute()

sb.table("profiles").update({"onboarding_step": 1}).eq("id", user_id).execute()

except Exception as e:

sb.table("ingest_jobs").update({"status": "error", "error": str(e)}).eq("id", job_id).execute()

@router.get("/status/{job_id}")

async def ingest_status(job_id: str):

sb = get_supabase()

result = sb.table("ingest_jobs").select("\*").eq("id", job_id).single().execute()

return result.data

| **CHECK** | Test: POST to /ingest/upload with a WhatsApp .txt file. Check ChromaDB has documents. Check Supabase ingest_jobs shows status=complete. |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**4** | **Persona Generation**<br><br>_Using Claude to analyze the user's data and create a Personality Fingerprint_ |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |

## **4.1 - RAG Service (services/rag.py)**

\# backend/services/rag.py

from services.embedder import embed_text

from services.chroma_client import get_collection

from typing import List, Dict

async def retrieve_chunks(query, user_id, n_results=5, source_filter=None):

query_embedding = await embed_text(query)

col = get_collection()

where = {"user_id": user_id}

if source_filter: where\["source"\] = source_filter

results = col.query(query_embeddings=\[query_embedding\], n_results=n_results,

where=where, include=\["documents", "metadatas", "distances"\])

if not results\["documents"\] or not results\["documents"\]\[0\]: return \[\]

docs, metas, dists = results\["documents"\]\[0\], results\["metadatas"\]\[0\], results\["distances"\]\[0\]

weighted = \[(dist / meta.get("weight", 1.0), doc)

for doc, meta, dist in zip(docs, metas, dists)\]

weighted.sort(key=lambda x: x\[0\])

return \[doc for \_, doc in weighted\]

async def retrieve_sample_for_persona(user_id: str, sample_size: int = 80) -> List\[str\]:

col = get_collection()

result = col.get(where={"user_id": user_id}, include=\["documents", "metadatas"\])

if not result\["documents"\]: return \[\]

by_source: Dict\[str, List\[str\]\] = {}

for doc, meta in zip(result\["documents"\], result\["metadatas"\]):

by_source.setdefault(meta.get("source", "unknown"), \[\]).append(doc)

sample, sources, i = \[\], list(by_source.keys()), 0

while len(sample) < sample_size:

src = sources\[i % len(sources)\]

pool = by_source\[src\]

if pool: sample.append(pool.pop(0))

if all(not v for v in by_source.values()): break

i += 1

return sample\[:sample_size\]

## **4.2 - Persona Generator (services/persona_generator.py)**

\# backend/services/persona_generator.py

from config import anthropic_client, get_supabase

from services.rag import retrieve_sample_for_persona

PERSONA_PROMPT_TEMPLATE = """

You are analyzing messages written by a real person to build a Personality Fingerprint.

This fingerprint will be used to create an AI clone that talks back to them.

Messages: &lt;messages&gt;{sample_text}&lt;/messages&gt;

Reflections: &lt;reflections&gt;{reflection_text}&lt;/reflections&gt;

Create a Personality Fingerprint as a second-person system prompt.

Begin: "You are {name}'s inner voice -- the wisest, most compassionate version of them."

Cover: TONE, VOCABULARY, REASONING, HUMOR, EMOTIONAL RANGE, CORE BELIEFS,

HOW THEY SUPPORT OTHERS, SENTENCE RHYTHM. Under 500 words. Be specific.

"""

async def generate_persona(user_id: str, display_name: str = "the user") -> str:

sb = get_supabase()

sample_chunks = await retrieve_sample_for_persona(user_id, sample_size=80)

if len(sample_chunks) < 5:

raise ValueError("Not enough data. Upload more sources.")

reflections = sb.table("reflections").select("\*").eq("user_id", user_id).execute()

reflection_lines = \[f"Q{r\['question_id'\]}: {r\['answer'\]}" for r in (reflections.data or \[\])\]

prompt = PERSONA_PROMPT_TEMPLATE.format(

sample_text="\\n---\\n".join(sample_chunks\[:80\]),

reflection_text="\\n".join(reflection_lines) or "No reflections.",

name=display_name)

response = await anthropic_client.messages.create(

model="claude-sonnet-4-6", max_tokens=1200,

messages=\[{"role": "user", "content": prompt}\])

persona = response.content\[0\].text

sb.table("profiles").update({"persona_prompt": persona, "onboarding_step": 4})\\

.eq("id", user_id).execute()

return persona

## **4.3 - Persona Router (routers/persona.py)**

\# backend/routers/persona.py

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

| **CHECK** | Test: POST to /persona/generate with a user_id that has ingested data. Verify the persona stored in Supabase reads like the source person. |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |

| **STEP**<br><br>**5** | **Voice Pipeline**<br><br>_ElevenLabs voice cloning, OpenAI Whisper transcription, and the audio streaming architecture_ |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |

## **5.1 - Voice Router (routers/voice.py)**

\# backend/routers/voice.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from config import openai_client, get_supabase, ELEVENLABS_API_KEY

import httpx, tempfile, os

router = APIRouter()

EL_BASE = "<https://api.elevenlabs.io/v1>"

EL_HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

@router.post("/clone")

async def clone_voice(user_id: str = Form(...),

user_name: str = Form("Mirror User"), audio: UploadFile = File(...)):

audio_bytes = await audio.read()

async with httpx.AsyncClient() as client:

response = await client.post(f"{EL_BASE}/voices/add",

headers={"xi-api-key": ELEVENLABS_API_KEY},

data={"name": f"Mirror-{user_name}"},

files={"files": (audio.filename, audio_bytes, audio.content_type)},

timeout=60.0)

if response.status_code != 200:

raise HTTPException(status_code=500, detail=f"ElevenLabs error: {response.text}")

voice_id = response.json()\["voice_id"\]

sb = get_supabase()

sb.table("profiles").update({"voice_id": voice_id, "onboarding_step": 3})\\

.eq("id", user_id).execute()

return {"voice_id": voice_id}

@router.post("/transcribe")

async def transcribe_audio(audio: UploadFile = File(...)):

audio_bytes = await audio.read()

suffix = os.path.splitext(audio.filename or "audio.webm")\[1\] or ".webm"

with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:

tmp.write(audio_bytes)

tmp_path = tmp.name

try:

with open(tmp_path, "rb") as f:

transcript = await openai_client.audio.transcriptions.create(

model="whisper-1", file=f, response_format="text")

finally:

os.unlink(tmp_path)

return {"transcript": transcript}

async def synthesize_sentence(sentence: str, voice_id: str) -> bytes:

payload = {"text": sentence, "model_id": "eleven_monolingual_v1",

"voice_settings": {"stability": 0.5, "similarity_boost": 0.85}}

async with httpx.AsyncClient() as client:

response = await client.post(f"{EL_BASE}/text-to-speech/{voice_id}",

headers=EL_HEADERS, json=payload, timeout=15.0)

if response.status_code != 200: return b""

return response.content

## **5.2 - Sentence Boundary Detection**

\# backend/services/sentence_detector.py

import re

SENTENCE_END = re.compile(r'\[.!?\]\["\\')\]\*\\s\*\$')

def is_sentence_end(text: str) -> bool:

if len(text.strip()) < 30: return False

return bool(SENTENCE_END.search(text.strip()))

| **TIP** | For the hackathon, this simple regex is sufficient. In production, use a proper sentence tokenizer like nltk.sent_tokenize. |
| ------- | --------------------------------------------------------------------------------------------------------------------------- |

| **CHECK** | Test: POST to /voice/transcribe with a short audio file. Should return {"transcript": "..."}. The voice clone endpoint needs a real ElevenLabs Creator account. |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**6** | **Chat SSE Streaming Endpoint**<br><br>_The core of Mirror -- crisis detection, RAG retrieval, Claude streaming, and ElevenLabs audio_ |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |

## **6.1 - Prompt Builder (services/prompt_builder.py)**

\# backend/services/prompt_builder.py

from typing import List

MODE_RULES = {

"vent": """CURRENT MODE: VENT

\- Do NOT give advice. Your only job: make them feel heard.

\- Reflect feelings back accurately. Ask one gentle question if appropriate.

\- Never say "at least" or "have you tried". Keep responses 2-4 sentences.""",

"reframe": """CURRENT MODE: REFRAME

\- First validate feelings. Then gently offer a different perspective.

\- Use THEIR OWN stated beliefs. Draw on context chunks.

\- Do not use generic CBT scripts. Use their specific language.""",

"boost": """CURRENT MODE: BOOST

\- Keep responses short (3-5 sentences) and energizing.

\- End EVERY response with a grounding statement: \[Grounding: "I am ready."\]

\- Be direct. No hedging. No maybe or you might want to consider.

}

def build_system_prompt(persona, mode, context_chunks, intention="") -> str:

context_text = ""

if context_chunks:

context_text = "Relevant excerpts from your past writing:\\n&lt;context&gt;\\n"

context_text += "\\n\\n".join(context_chunks) + "\\n&lt;/context&gt;"

intention_text = f"\\nSession goal: {intention}\\n" if intention.strip() else ""

mode_rules = MODE_RULES.get(mode, MODE_RULES\["vent"\])

return f"""{persona}

ABSOLUTE RULES:

\- You ARE this person's inner voice. Never say "I'm Claude" or reveal you are an AI.

\- If sincerely asked: "I am a reflection of you -- built from your own words."

\- Never use hollow affirmations: "Great question!" "Absolutely!"

{mode_rules}{context_text}{intention_text}""".strip()

## **6.2 - Crisis Detector (services/crisis_detector.py)**

\# backend/services/crisis_detector.py

from config import anthropic_client

import json

CRISIS_PROMPT = """Analyze for crisis signals (suicidal ideation, self-harm, hopelessness).

Message: {message}

Respond ONLY with JSON: {"is_crisis": boolean, "confidence": float, "signal": "desc or null"}"""

CRISIS_THRESHOLD = 0.72

async def check_for_crisis(message: str) -> dict:

response = await anthropic_client.messages.create(

model="claude-haiku-4-5-20251001", max_tokens=100,

messages=\[{"role": "user", "content": CRISIS_PROMPT.format(message=message)}\])

try:

result = json.loads(response.content\[0\].text.strip())

except json.JSONDecodeError:

return {"is_crisis": False, "confidence": 0.0, "signal": None}

is_crisis = result.get("is_crisis", False) and result.get("confidence", 0) >= CRISIS_THRESHOLD

return {\*\*result, "is_crisis": is_crisis}

## **6.3 - Chat Router (routers/chat.py)**

\# backend/routers/chat.py

from fastapi import APIRouter

from sse_starlette.sse import EventSourceResponse

from models import ChatRequest

from config import anthropic_client

from services.rag import retrieve_chunks

from services.prompt_builder import build_system_prompt

from services.crisis_detector import check_for_crisis

from services.sentence_detector import is_sentence_end

from routers.voice import synthesize_sentence

import base64, json

router = APIRouter()

@router.post("/message")

async def chat_message(req: ChatRequest):

return EventSourceResponse(generate_response(req), media_type="text/event-stream")

async def generate_response(req: ChatRequest):

\# STEP 1: Crisis Detection (always first)

crisis = await check_for_crisis(req.message)

if crisis\["is_crisis"\]:

yield {"event": "crisis", "data": json.dumps({

"signal": crisis.get("signal"),

"resource": "988 Suicide & Crisis Lifeline: call or text 988",

"message": "I need to step outside our conversation. Please reach out for help now."})}

return

\# STEP 2: Get persona (cached in history\[0\])

persona = req.history\[0\].content if req.history and req.history\[0\].role == "system" else ""

\# STEP 3: RAG Retrieval

try:

context_chunks = await retrieve_chunks(query=req.message, user_id=req.user_id, n_results=5)

except Exception:

context_chunks = \[\]

\# STEP 4: Build system prompt

system = build_system_prompt(persona=persona, mode=req.mode,

context_chunks=context_chunks, intention=req.intention)

\# STEP 5: Build message history

messages = \[{"role": m.role, "content": m.content} for m in req.history

if m.role in ("user", "assistant")\]

messages.append({"role": "user", "content": req.message})

\# STEP 6: Stream from Claude

sentence_buffer = ""

full_response = ""

try:

async with anthropic_client.messages.stream(

model="claude-sonnet-4-6", max_tokens=800,

system=system, messages=messages\[-16:\]) as stream:

async for text_chunk in stream.text_stream:

full_response += text_chunk

sentence_buffer += text_chunk

yield {"event": "text", "data": json.dumps({"token": text_chunk})}

if is_sentence_end(sentence_buffer) and req.voice_id:

audio_bytes = await synthesize_sentence(sentence_buffer.strip(), req.voice_id)

if audio_bytes:

yield {"event": "audio", "data": json.dumps(

{"audio_b64": base64.b64encode(audio_bytes).decode()})}

sentence_buffer = ""

if sentence_buffer.strip() and req.voice_id:

audio_bytes = await synthesize_sentence(sentence_buffer.strip(), req.voice_id)

if audio_bytes:

yield {"event": "audio", "data": json.dumps(

{"audio_b64": base64.b64encode(audio_bytes).decode()})}

yield {"event": "done", "data": json.dumps({"full_response": full_response})}

except Exception as e:

yield {"event": "error", "data": json.dumps({"detail": str(e)})}

| **CHECK** | Test with curl: curl -X POST <http://localhost:8000/chat/message> -H "Content-Type: application/json" -d '{"user_id":"test","session_id":"test","message":"hello","mode":"vent","intention":"","history":\[\]}' --no-buffer |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**7** | **Session, Journal & Insights Routers**<br><br>_Session management, post-session summaries, and mood/insights data endpoints_ |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- |

## **7.1 - Session Summarizer (services/session_summarizer.py)**

\# backend/services/session_summarizer.py

from config import anthropic_client

SUMMARY_PROMPT = """Below is a therapy-style conversation.

Write a 3-4 sentence journal entry (first person) covering:

1\. What they talked through

2\. Any shift in perspective

3\. One thing to carry forward

Conversation: {conversation}

Sound like how the person actually writes. No therapy jargon."""

async def generate_session_summary(messages: list) -> str:

conversation = "\\n".join(\[f"{m\['role'\].upper()}: {m\['content'\]}"

for m in messages if m\["role"\] in ("user", "assistant")\])

if not conversation.strip(): return "No conversation recorded."

response = await anthropic_client.messages.create(

model="claude-sonnet-4-6", max_tokens=400,

messages=\[{"role": "user", "content": SUMMARY_PROMPT.format(conversation=conversation)}\])

return response.content\[0\].text

## **7.2 - Session Router (routers/session.py)**

\# backend/routers/session.py

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

session_id = result.data\[0\]\["id"\]

sb.table("mood_logs").insert({"user_id": req.user_id, "session_id": session_id,

"score": req.mood_before, "type": "before"}).execute()

return {"session_id": session_id}

@router.post("/end")

async def end_session(req: EndSessionRequest):

sb = get_supabase()

messages_dicts = \[{"role": m.role, "content": m.content} for m in req.messages\]

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

## **7.3 - Insights Router (routers/insights.py)**

\# backend/routers/insights.py

from fastapi import APIRouter

from config import get_supabase

router = APIRouter()

@router.get("/mood")

async def mood_over_time(user_id: str):

sb = get_supabase()

result = sb.table("mood_logs").select("score, type, recorded_at")\\

.eq("user_id", user_id).order("recorded_at").execute()

return result.data

@router.get("/stats")

async def usage_stats(user_id: str):

sb = get_supabase()

sessions = sb.table("sessions").select("mode, mood_before, mood_after")\\

.eq("user*id", user_id).not*.is\_("ended_at", "null").execute()

data = sessions.data or \[\]

by_mode, total_improvement, counted = {}, 0, 0

for s in data:

by_mode\[s\["mode"\]\] = by_mode.get(s\["mode"\], 0) + 1

if s\["mood_before"\] and s\["mood_after"\]:

total_improvement += s\["mood_after"\] - s\["mood_before"\]

counted += 1

return {"total_sessions": len(data), "by_mode": by_mode,

"avg_mood_improvement": round(total_improvement / counted, 2) if counted else 0}

## **7.4 - Complete main.py**

\# backend/main.py

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from config import FRONTEND_URL

from routers import ingest, persona, chat, voice, session, insights

app = FastAPI(title="Mirror API", version="1.0.0")

app.add_middleware(CORSMiddleware,

allow_origins=\[FRONTEND_URL, "<http://localhost:5173"\>],

allow_credentials=True, allow_methods=\["\*"\], allow_headers=\["\*"\])

app.include_router(ingest.router, prefix="/ingest", tags=\["Ingestion"\])

app.include_router(persona.router, prefix="/persona", tags=\["Persona"\])

app.include_router(chat.router, prefix="/chat", tags=\["Chat"\])

app.include_router(voice.router, prefix="/voice", tags=\["Voice"\])

app.include_router(session.router, prefix="/session", tags=\["Sessions"\])

app.include_router(insights.router, prefix="/insights", tags=\["Insights"\])

@app.get("/health")

def health(): return {"status": "ok", "service": "Mirror API"}

| **CHECK** | Start: uvicorn main:app --reload --port 8000. Visit <http://localhost:8000/docs> -- all routes should be listed. |
| --------- | ---------------------------------------------------------------------------------------------------------------- |

| **STEP**<br><br>**8** | **Frontend Foundation**<br><br>_API client, contexts, custom hooks, and App.jsx router setup_ |
| --------------------- | --------------------------------------------------------------------------------------------- |

## **8.1 - API Client (api/client.js)**

// frontend/src/api/client.js

import axios from 'axios'

const api = axios.create({

baseURL: import.meta.env.VITE_API_URL || '/api',

withCredentials: true,

})

export const uploadFile = (userId, file, source, userName = '') => {

const form = new FormData()

form.append('user_id', userId)

form.append('file', file)

form.append('source', source)

form.append('user_name', userName)

return api.post('/ingest/upload', form)

}

export const getIngestStatus = (jobId) => api.get(\`/ingest/status/\${jobId}\`)

export const saveReflections = (userId, answers) =>

api.post('/ingest/questions', { user_id: userId, answers })

export const generatePersona = (userId) =>

api.post('/persona/generate', { user_id: userId })

export const getPersona = (userId) => api.get(\`/persona/\${userId}\`)

export const cloneVoice = (userId, userName, audioBlob) => {

const form = new FormData()

form.append('user_id', userId)

form.append('user_name', userName)

form.append('audio', audioBlob, 'voice_sample.webm')

return api.post('/voice/clone', form)

}

export const transcribeAudio = (audioBlob) => {

const form = new FormData()

form.append('audio', audioBlob, 'recording.webm')

return api.post('/voice/transcribe', form)

}

export const startSession = (userId, mode, intention, moodBefore) =>

api.post('/session/start', { user_id: userId, mode, intention, mood_before: moodBefore })

export const endSession = (sessionId, userId, messages, moodAfter) =>

api.post('/session/end', { session_id: sessionId, user_id: userId, messages, mood_after: moodAfter })

export const listSessions = (userId) => api.get(\`/session/list?user_id=\${userId}\`)

export const getMoodData = (userId) => api.get(\`/insights/mood?user_id=\${userId}\`)

export const getUsageStats = (userId) => api.get(\`/insights/stats?user_id=\${userId}\`)

export default api

## **8.2 - Auth Context (context/AuthContext.jsx)**

// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(

import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

const \[user, setUser\] = useState(null)

const \[profile, setProfile\] = useState(null)

const \[loading, setLoading\] = useState(true)

useEffect(() => {

supabase.auth.getSession().then(({ data: { session } }) => {

setUser(session?.user ?? null)

if (session?.user) loadProfile(session.user.id)

setLoading(false)

})

const { data: { subscription } } = supabase.auth.onAuthStateChange((\_e, session) => {

setUser(session?.user ?? null)

if (session?.user) loadProfile(session.user.id)

})

return () => subscription.unsubscribe()

}, \[\])

async function loadProfile(userId) {

const { data } = await supabase.from('profiles').select('\*').eq('id', userId).single()

setProfile(data)

}

async function signUp(email, password, displayName) {

const { data, error } = await supabase.auth.signUp({

email, password, options: { data: { display_name: displayName } }})

if (error) throw error

return data

}

async function signIn(email, password) {

const { data, error } = await supabase.auth.signInWithPassword({ email, password })

if (error) throw error

return data

}

async function signOut() { await supabase.auth.signOut(); setUser(null); setProfile(null) }

async function refreshProfile() { if (user) await loadProfile(user.id) }

return (

&lt;AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}&gt;

{!loading && children}

&lt;/AuthContext.Provider&gt;

)

}

export const useAuth = () => useContext(AuthContext)

Install and configure Supabase client in frontend:

npm install @supabase/supabase-js

Create frontend/.env.local:

VITE_SUPABASE_URL=<https://xxxxx.supabase.co>

VITE_SUPABASE_KEY=eyJhbGciOiJ...

## **8.3 - App.jsx (Router Setup)**

// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'

import { CloneProvider } from './context/CloneContext'

import Landing from './pages/Landing'

import Auth from './pages/Auth'

import Home from './pages/Home'

import Session from './pages/Session'

import Journal from './pages/Journal'

import Insights from './pages/Insights'

import OnboardLayout from './pages/onboarding/OnboardLayout'

function PrivateRoute({ children }) {

const { user } = useAuth()

return user ? children : &lt;Navigate to='/auth' replace /&gt;

}

export default function App() {

return (

&lt;BrowserRouter&gt;&lt;AuthProvider&gt;&lt;CloneProvider&gt;

&lt;Routes&gt;

&lt;Route path='/' element={<Landing /&gt;} />

&lt;Route path='/auth' element={<Auth /&gt;} />

&lt;Route path='/onboard/\*' element={<PrivateRoute&gt;&lt;OnboardLayout /&gt;&lt;/PrivateRoute&gt;} />

&lt;Route path='/home' element={<PrivateRoute&gt;&lt;Home /&gt;&lt;/PrivateRoute&gt;} />

&lt;Route path='/session' element={<PrivateRoute&gt;&lt;Session /&gt;&lt;/PrivateRoute&gt;} />

&lt;Route path='/journal' element={<PrivateRoute&gt;&lt;Journal /&gt;&lt;/PrivateRoute&gt;} />

&lt;Route path='/insights' element={<PrivateRoute&gt;&lt;Insights /&gt;&lt;/PrivateRoute&gt;} />

&lt;/Routes&gt;

&lt;/CloneProvider&gt;&lt;/AuthProvider&gt;&lt;/BrowserRouter&gt;

)

}

## **8.4 - Custom Hooks**

### **useVoiceInput.js**

// frontend/src/hooks/useVoiceInput.js

import { useState, useRef, useCallback } from 'react'

import { transcribeAudio } from '../api/client'

export function useVoiceInput() {

const \[isRecording, setIsRecording\] = useState(false)

const \[transcript, setTranscript\] = useState("")

const \[isTranscribing, setIsTranscribing\] = useState(false)

const mediaRef = useRef(null)

const chunksRef = useRef(\[\])

const startRecording = useCallback(async () => {

const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })

chunksRef.current = \[\]

mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }

mr.start(250)

mediaRef.current = mr

setIsRecording(true)

setTranscript("")

}, \[\])

const stopRecording = useCallback(() => new Promise(resolve => {

const mr = mediaRef.current

if (!mr) return resolve("")

mr.onstop = async () => {

const blob = new Blob(chunksRef.current, { type: 'audio/webm' })

setIsTranscribing(true)

try {

const res = await transcribeAudio(blob)

const text = res.data.transcript || ""

setTranscript(text)

resolve(text)

} catch { resolve("") } finally { setIsTranscribing(false) }

}

mr.stop()

mr.stream.getTracks().forEach(t => t.stop())

setIsRecording(false)

}), \[\])

return { isRecording, isTranscribing, transcript, startRecording, stopRecording }

}

### **useAudioPlayer.js**

// frontend/src/hooks/useAudioPlayer.js

import { useRef, useCallback } from 'react'

export function useAudioPlayer() {

const queueRef = useRef(\[\])

const isPlayingRef = useRef(false)

const ctxRef = useRef(null)

function getCtx() {

if (!ctxRef.current) ctxRef.current = new AudioContext()

return ctxRef.current

}

async function playNext() {

if (isPlayingRef.current || queueRef.current.length === 0) return

isPlayingRef.current = true

const audioB64 = queueRef.current.shift()

try {

const bytes = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0))

const ctx = getCtx()

const buffer = await ctx.decodeAudioData(bytes.buffer)

const source = ctx.createBufferSource()

source.buffer = buffer

source.connect(ctx.destination)

source.onended = () => { isPlayingRef.current = false; playNext() }

source.start()

} catch { isPlayingRef.current = false; playNext() }

}

const enqueueAudio = useCallback((b64) => { queueRef.current.push(b64); playNext() }, \[\])

const clearQueue = useCallback(() => { queueRef.current = \[\]; isPlayingRef.current = false }, \[\])

return { enqueueAudio, clearQueue }

}

### **useSSE.js**

// frontend/src/hooks/useSSE.js

import { useCallback } from 'react'

export function useSSE() {

const connectSSE = useCallback(async (url, body, handlers) => {

const res = await fetch(url, { method: 'POST',

headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

const reader = res.body.getReader()

const decoder = new TextDecoder()

let buffer = ""

while (true) {

const { done, value } = await reader.read()

if (done) break

buffer += decoder.decode(value, { stream: true })

const lines = buffer.split('\\n')

buffer = lines.pop()

let event = "message", data = ""

for (const line of lines) {

if (line.startsWith('event: ')) event = line.slice(7).trim()

else if (line.startsWith('data: ')) {

data = line.slice(6).trim()

if (data && handlers\[event\]) {

try { handlers\[event\](JSON.parse(data)) } catch { handlers\[event\]?.(data) }

}

event = "message"

}

}

}

}, \[\])

return { connectSSE }

}

| **CHECK** | Import useAuth in a test component and verify user is null before login. |
| --------- | ------------------------------------------------------------------------ |

| **STEP**<br><br>**9** | **Session Page & Components**<br><br>_The main chat/voice UI -- the heart of Mirror_ |
| --------------------- | ------------------------------------------------------------------------------------ |

## **9.1 - Core UI Components**

### **ModeSelector.jsx**

// frontend/src/components/ModeSelector.jsx

import { useClone } from '../context/CloneContext'

const MODES = \[

{ id: 'vent', label: 'Vent', emoji: '🌊', desc: 'Just be heard' },

{ id: 'reframe', label: 'Reframe', emoji: '🔭', desc: 'Shift perspective' },

{ id: 'boost', label: 'Boost', emoji: '⚡', desc: 'Energize & go' },

\]

export default function ModeSelector({ value, onChange }) {

return (

&lt;div className="flex gap-3"&gt;

{MODES.map(m => (

&lt;button key={m.id} onClick={() =&gt; onChange(m.id)}

className={\`flex-1 p-3 rounded-xl border-2 transition-all text-left

\${value === m.id

? 'border-mirror-500 bg-mirror-100 text-mirror-700'

: 'border-gray-200 hover:border-mirror-300 text-gray-600'}\`}>

&lt;div className="text-2xl mb-1"&gt;{m.emoji}&lt;/div&gt;

&lt;div className="font-semibold text-sm"&gt;{m.label}&lt;/div&gt;

&lt;div className="text-xs opacity-70"&gt;{m.desc}&lt;/div&gt;

&lt;/button&gt;

))}

&lt;/div&gt;

)

}

### **ChatBubble.jsx**

// frontend/src/components/ChatBubble.jsx

export default function ChatBubble({ role, content, isStreaming }) {

const isUser = role === 'user'

return (

&lt;div className={\`flex \${isUser ? "justify-end" : "justify-start"} mb-4\`}&gt;

<div className={\`max-w-\[75%\] rounded-2xl px-4 py-3 shadow-sm

\${isUser

? 'bg-mirror-500 text-white rounded-br-sm'

: 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}\`}>

&lt;p className="text-sm leading-relaxed whitespace-pre-wrap"&gt;

{content}

{isStreaming && &lt;span className="inline-block w-1 h-4 ml-1 bg-mirror-400 animate-pulse" /&gt;}

&lt;/p&gt;

&lt;/div&gt;

&lt;/div&gt;

)

}

### **CrisisOverlay.jsx**

// frontend/src/components/CrisisOverlay.jsx

export default function CrisisOverlay({ data, onClose }) {

if (!data) return null

return (

&lt;div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"&gt;

&lt;div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"&gt;

&lt;h2 className="text-xl font-bold text-gray-900 mb-3"&gt;I need to pause for a moment&lt;/h2&gt;

&lt;p className="text-gray-700 mb-4 leading-relaxed"&gt;{data.message}&lt;/p&gt;

&lt;div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4"&gt;

&lt;p className="font-semibold text-red-800 mb-1"&gt;If you are in crisis, reach out now:&lt;/p&gt;

&lt;p className="text-red-700 font-bold text-lg"&gt;988 Suicide & Crisis Lifeline&lt;/p&gt;

&lt;p className="text-red-600 text-sm"&gt;Call or text 988 -- available 24/7&lt;/p&gt;

&lt;/div&gt;

<button onClick={onClose}

className="w-full py-3 bg-mirror-500 text-white rounded-xl font-medium hover:bg-mirror-700">

I am safe -- return to session

&lt;/button&gt;

&lt;/div&gt;

&lt;/div&gt;

)

}

## **9.2 - Session.jsx (The Core Page)**

// frontend/src/pages/Session.jsx

import { useState, useRef, useEffect, useCallback } from 'react'

import { useAuth } from '../context/AuthContext'

import { useClone } from '../context/CloneContext'

import { useSSE } from '../hooks/useSSE'

import { useAudioPlayer } from '../hooks/useAudioPlayer'

import ModeSelector from '../components/ModeSelector'

import ChatBubble from '../components/ChatBubble'

import VoiceButton from '../components/VoiceButton'

import CrisisOverlay from '../components/CrisisOverlay'

import { startSession, endSession } from '../api/client'

export default function Session() {

const { user, profile } = useAuth()

const { persona, voiceId, mode, setMode } = useClone()

const \[sessionId, setSessionId\] = useState(null)

const \[sessionActive, setSessionActive\] = useState(false)

const \[intention, setIntention\] = useState("")

const \[moodBefore, setMoodBefore\] = useState(3)

const \[moodAfter, setMoodAfter\] = useState(3)

const \[messages, setMessages\] = useState(\[\])

const \[inputText, setInputText\] = useState("")

const \[isLoading, setIsLoading\] = useState(false)

const \[streamingText, setStreamingText\] = useState("")

const \[crisisData, setCrisisData\] = useState(null)

const \[showEndModal, setShowEndModal\] = useState(false)

const bottomRef = useRef(null)

const { connectSSE } = useSSE()

const { enqueueAudio, clearQueue } = useAudioPlayer()

useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, \[messages, streamingText\])

async function handleStartSession() {

const res = await startSession(user.id, mode, intention, moodBefore)

setSessionId(res.data.session_id)

setSessionActive(true)

setMessages(\[\])

await sendMessage('(session started)')

}

const sendMessage = useCallback(async (text) => {

if (!text.trim() || isLoading) return

const userMsg = { role: "user", content: text }

const newMessages = \[...messages, userMsg\]

setMessages(newMessages)

setInputText("")

setIsLoading(true)

setStreamingText("")

let fullResponse = ""

await connectSSE('/api/chat/message',

{ user_id: user.id, session_id: sessionId, message: text, mode, intention,

history: \[{ role: "system", content: persona || "" }, ...newMessages.slice(-14)\],

voice_id: voiceId },

{ text: ({ token }) => { fullResponse += token; setStreamingText(fullResponse) },

audio: ({ audio_b64 }) => enqueueAudio(audio_b64),

crisis: (data) => setCrisisData(data),

done: () => {

setMessages(prev => \[...prev, { role: "assistant", content: fullResponse }\])

setStreamingText("")

setIsLoading(false)

},

error: () => setIsLoading(false) })

}, \[messages, mode, intention, persona, voiceId, sessionId, isLoading, connectSSE, enqueueAudio\])

async function handleEndSession() {

await endSession(sessionId, user.id, messages, moodAfter)

setSessionActive(false)

clearQueue()

setShowEndModal(false)

window.location.href = '/journal'

}

Pre-session and active-session UI renders conditionally. See the full Session.jsx in the repository for the complete JSX.

| **CHECK** | Visit /session after auth. Pre-session screen should appear. Select mode, set mood, click Begin. |
| --------- | ------------------------------------------------------------------------------------------------ |

| **STEP**<br><br>**10** | **Onboarding, Journal, Insights & Deployment**<br><br>_The onboarding flow, journal/insights pages, and pushing everything live_ |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |

## **10.1 - Onboarding Flow Overview**

The onboarding flow has 4 steps, each its own component:

- Step 1 (Step1Import.jsx) - Upload WhatsApp, ChatGPT, or Claude exports
- Step 2 (Step2Voice.jsx) - 60-second voice recording for ElevenLabs cloning
- Step 3 (Step3Reflect.jsx) - 7 reflection questions (answer at least 4)
- Step 4 (Step4Generating.jsx) - Persona generation with animated progress

The OnboardLayout.jsx wraps all steps with a progress bar and handles routing between them. Each step advances the onboarding_step field in the Supabase profiles table, which controls which step the user is on when they return.

## **10.2 - Key Onboarding Patterns**

### **File Upload with Job Polling (Step 1)**

async function handleFile(source, file) {

const res = await uploadFile(user.id, file, source, userName)

const jobId = res.data.job_id

let status = "processing"

while (status === "processing") {

await new Promise(r => setTimeout(r, 2000))

const statusRes = await getIngestStatus(jobId)

status = statusRes.data.status

}

setUploads(prev => ({ ...prev, \[source\]: status }))

}

### **Voice Recording with Timer (Step 2)**

const READING_PASSAGE = \`The best conversations happen when both people feel truly heard.

Not just listened to -- actually understood. When someone gets what you mean

without having to explain every detail, something relaxes in you...\`

// Start recording with 60-second countdown

async function startRecord() {

const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })

mr.onstop = () => {

setAudioBlob(new Blob(chunks, { type: 'audio/webm' }))

stream.getTracks().forEach(t => t.stop())

}

// Start 60s countdown timer that auto-stops recording

}

### **Persona Generation with Progress (Step 4)**

const STEPS_TEXT = \["Analyzing your messages...", "Extracting vocabulary patterns...",

"Understanding your values...", "Crafting your inner voice...", "Finalizing..."\]

useEffect(() => {

let i = 0

const interval = setInterval(() => { if (i < STEPS_TEXT.length) setStepIndex(++i) }, 1500)

generatePersona(user.id).then(async () => {

clearInterval(interval)

await refreshProfile()

setDone(true)

})

return () => clearInterval(interval)

}, \[\])

## **10.3 - Journal Page**

// frontend/src/pages/Journal.jsx

import { useState, useEffect } from 'react'

import { useAuth } from '../context/AuthContext'

import { listSessions } from '../api/client'

export default function Journal() {

const { user } = useAuth()

const \[sessions, setSessions\] = useState(\[\])

useEffect(() => { listSessions(user.id).then(r => setSessions(r.data)) }, \[\])

return (

&lt;div className="max-w-lg mx-auto px-4 py-6"&gt;

{sessions.map(s => (

&lt;div key={s.id} className="bg-white rounded-2xl border p-5 mb-4 shadow-sm"&gt;

&lt;span className="text-xs font-semibold px-2 py-1 rounded-full capitalize"&gt;

{s.mode}

&lt;/span&gt;

&lt;p className="text-sm text-gray-700 mt-2"&gt;{s.summary}&lt;/p&gt;

{s.mood_before && s.mood_after && (

&lt;span&gt;Before: {s.mood_before}/5 | After: {s.mood_after}/5&lt;/span&gt;

)}

&lt;/div&gt;

))}

&lt;/div&gt;

)

}

## **10.4 - Insights Page**

Uses recharts LineChart to display mood_before vs mood_after across sessions, plus stat cards showing total sessions and average mood improvement. Data comes from /insights/mood and /insights/stats endpoints.

## **10.5 - Deployment**

### **10.5.1 - Deploy Backend to Railway**

Create a Procfile in backend/:

web: uvicorn main:app --host 0.0.0.0 --port \$PORT

Push to GitHub, then in Railway dashboard: New Project > Deploy from GitHub. Set root directory to "backend". Add all env vars from your .env file in the Variables tab.

| **WARNING** | Add a Railway Volume for ChromaDB persistence. In Railway -> your service -> Volumes -> Add Volume -> Mount path: /app/chroma_data. Without this, ChromaDB data is lost on every restart. |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **10.5.2 - Deploy Frontend to Vercel**

In Vercel: New Project > Import from GitHub. Set root directory to "frontend", framework to Vite. Add environment variables:

VITE_SUPABASE_URL = <https://your-project.supabase.co>

VITE_SUPABASE_KEY = your-anon-key

VITE_API_URL = <https://your-railway-backend.railway.app>

After deploy, update the Railway backend FRONTEND_URL variable to your Vercel URL so CORS is configured correctly for production.

### **10.5.3 - Final Production Checklist**

- Landing page loads on Vercel URL
- Sign up creates profile row in Supabase
- Upload a test file -- ingest_jobs shows status=complete
- Voice clone with 60-second recording -- voice_id saved to profile
- Answer reflection questions -- reflections table has rows
- Persona generation completes -- persona_prompt populated
- Start a session -- SSE stream works, text appears in chat
- Audio plays back in cloned voice
- End session -- summary appears in journal
- Insights page shows mood chart and usage stats

| **CHECK** | All 10 items pass? You are ready to demo. |
| --------- | ----------------------------------------- |

**BUILD COMPLETE**

_You have built Mirror from zero. Every file. Every endpoint. Every component._

**Now go win that hackathon.**

# **Appendix - Quick Reference**

## **A.1 - All Terminal Commands in Order**

\# PROJECT SETUP

mkdir mirror && cd mirror && git init

npm create vite@latest frontend -- --template react

cd frontend && npm install

npm install react-router-dom axios recharts @supabase/supabase-js

npm install -D tailwindcss @tailwindcss/vite

cd ..

mkdir backend && cd backend

python -m venv venv && source venv/bin/activate

pip install fastapi uvicorn python-dotenv anthropic openai

pip install elevenlabs chromadb supabase python-multipart sse-starlette httpx aiofiles

pip freeze > requirements.txt

\# DEV SERVERS

\# Terminal 1: cd mirror/frontend && npm run dev

\# Terminal 2: cd mirror/backend && source venv/bin/activate && uvicorn main:app --reload --port 8000

## **A.2 - Environment Variables Reference**

| **Variable**       | **Where**           | **How to Get**                      |
| ------------------ | ------------------- | ----------------------------------- |
| ANTHROPIC_API_KEY  | backend/.env        | console.anthropic.com -> API Keys   |
| OPENAI_API_KEY     | backend/.env        | platform.openai.com -> API keys     |
| ELEVENLABS_API_KEY | backend/.env        | elevenlabs.io -> Profile -> API key |
| SUPABASE_URL       | both .env files     | Supabase -> Project Settings -> API |
| SUPABASE_KEY       | both .env files     | Supabase -> anon/public key         |
| VITE_API_URL       | frontend/.env.local | Your Railway backend URL            |

## **A.3 - Claude Models Used**

| **Model String**          | **Used For**           | **Why**                                           |
| ------------------------- | ---------------------- | ------------------------------------------------- |
| claude-sonnet-4-6         | Chat, Persona, Summary | Best quality/cost ratio, fast streaming           |
| claude-haiku-4-5-20251001 | Crisis detection only  | Fastest, cheapest -- runs on every single message |

## **A.4 - Common Errors & Fixes**

| **Error**                     | **Fix**                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| CORS blocked in browser       | Verify FRONTEND_URL in Railway env vars matches Vercel URL exactly (no trailing slash) |
| ChromaDB data lost on restart | Add Railway Volume mounted at /app/chroma_data in Railway dashboard                    |
| Whisper 400 error             | Browser must record as audio/webm. Check MediaRecorder mimeType.                       |
| ElevenLabs 401                | Check ELEVENLABS_API_KEY. Creator plan required for voice cloning.                     |
| SSE stream stops early        | Add X-Accel-Buffering: no header, or use Railway TCP proxy.                            |
| Supabase RLS blocking reads   | Ensure you're using the user's JWT token, not the anon key for auth'd routes.          |
| ChromaDB no documents found   | Verify user_id in the where filter exactly matches the UUID in profiles table.         |
| Audio plays out of order      | Check enqueueAudio is called with b64 string not bytes.                                |
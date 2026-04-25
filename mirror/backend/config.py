# backend/config.py
import os
from dotenv import load_dotenv
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from supabase import create_client, Client

load_dotenv()

ANTHROPIC_API_KEY  = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY     = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
SUPABASE_URL       = os.getenv("SUPABASE_URL")
SUPABASE_KEY       = os.getenv("SUPABASE_KEY")
FRONTEND_URL       = os.getenv("FRONTEND_URL", "http://localhost:5173")

# AI clients
anthropic_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
openai_client    = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
# Supabase client
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

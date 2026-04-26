# backend/config.py
import os
import base64
import json
from dotenv import load_dotenv
from anthropic import AsyncAnthropic
from openai import AsyncOpenAI
from supabase import create_client, Client

load_dotenv()

ANTHROPIC_API_KEY  = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY     = os.getenv("OPENAI_API_KEY")
SMALLEST_API_KEY = os.getenv("SMALLEST_API_KEY")
SUPABASE_URL       = os.getenv("SUPABASE_URL")
SUPABASE_KEY       = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FRONTEND_URL       = os.getenv("FRONTEND_URL", "http://localhost:5173")

# AI clients
anthropic_client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
openai_client    = AsyncOpenAI(
    api_key=OPENAI_API_KEY,
    max_retries=2,
    timeout=30.0,
) if OPENAI_API_KEY else None


def _jwt_role(jwt_key: str) -> str | None:
    try:
        payload = jwt_key.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload.encode("utf-8")).decode("utf-8")
        return json.loads(decoded).get("role")
    except Exception:
        return None


def _get_backend_supabase_key() -> str:
    # Prefer explicit service-role key, but allow legacy SUPABASE_KEY if it is service_role.
    key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY
    if not SUPABASE_URL or not key:
        raise RuntimeError(
            "Missing SUPABASE_URL or backend Supabase key. "
            "Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_KEY (service_role only)."
        )

    # Supabase now issues secret keys with an sb_secret_ prefix.
    if key.startswith("sb_secret_"):
        return key
    if key.startswith("sb_publishable_"):
        raise RuntimeError(
            "Backend requires a Supabase service role key. "
            "Set SUPABASE_SERVICE_ROLE_KEY to a secret/service key, not a publishable key."
        )

    role = _jwt_role(key)
    print("DECODED ROLE:", role)
    if role != "service_role":
        raise RuntimeError(
            "Backend requires a Supabase service role key. "
            "Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_KEY to a service_role key."
        )
    return key


# Supabase client
def get_supabase() -> Client:
    return create_client(SUPABASE_URL, _get_backend_supabase_key())

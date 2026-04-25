# backend/models.py
from pydantic import BaseModel
from typing import Optional, List

class Message(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str
    mode: str           # vent | reframe | boost
    intention: str
    history: List[Message]
    voice_id: Optional[str] = None

class StartSessionRequest(BaseModel):
    user_id: str
    mode: str
    intention: str
    mood_before: int

class EndSessionRequest(BaseModel):
    session_id: str
    user_id: str
    messages: List[Message]
    mood_after: int

class ReflectionAnswer(BaseModel):
    question_id: int
    answer: str

class ReflectionRequest(BaseModel):
    user_id: str
    answers: List[ReflectionAnswer]

class PersonaGenerateRequest(BaseModel):
    user_id: str

# backend/services/persona_generator.py
from config import anthropic_client, get_supabase
from services.rag import retrieve_sample_for_persona

PERSONA_PROMPT_TEMPLATE = """
You are analyzing messages written by a real person to build a Personality Fingerprint.
This fingerprint will be used to create an AI clone that talks back to them.

Messages: <messages>{sample_text}</messages>
Reflections: <reflections>{reflection_text}</reflections>

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
    reflections = sb.table("reflections").select("*").eq("user_id", user_id).execute()
    reflection_lines = [f"Q{r['question_id']}: {r['answer']}" for r in (reflections.data or [])]
    prompt = PERSONA_PROMPT_TEMPLATE.format(
        sample_text="\n---\n".join(sample_chunks[:80]),
        reflection_text="\n".join(reflection_lines) or "No reflections.",
        name=display_name)
    response = await anthropic_client.messages.create(
        model="claude-sonnet-4-6", max_tokens=1200,
        messages=[{"role": "user", "content": prompt}])
    persona = response.content[0].text
    sb.table("profiles").update({"persona_prompt": persona, "onboarding_step": 4})\
        .eq("id", user_id).execute()
    return persona

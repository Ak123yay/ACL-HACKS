**MIRROR**

_Talk to Yourself. Heal Yourself._

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Complete Business Plan & Technical Implementation Guide**

Hackathon Edition - Full Stack Build Blueprint

Version 1.0 | April 2026

**CONFIDENTIAL**

# **Table of Contents**

1\. Executive Summary 3

2\. The Problem - Why This Matters 4

3\. The Solution - What Mirror Does 6

4\. Research Foundation 8

5\. Target Audience & User Personas 10

6\. Competitive Landscape 12

7\. Product Features - Complete List 14

8\. Frontend Design & Architecture 17

9\. Backend Design & Architecture 21

10\. AI Layer - Claude, Whisper, ElevenLabs 26

11\. Database Design 30

12\. Data Ingestion Pipeline 32

13\. Complete File & Folder Structure 35

14\. Step-by-Step Build Instructions 37

15\. API Reference 44

16\. Cost Breakdown 47

17\. Business Model & Revenue Strategy 49

18\. 48-Hour Hackathon Build Plan 51

19\. Demo Script & Pitch Guide 53

20\. Risk Analysis & Mitigations 55

# **1\. Executive Summary**

| **MISSION** | Mirror gives every person access to their own wisest self - an AI persona built from their real words, values, and voice that talks them through stress, self-doubt, and emotional overwhelm. |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

Mirror is an AI-powered mental wellness application that creates a personalized AI clone of the user using their own writing, chat exports, and recorded voice. Unlike generic therapy bots, Mirror responds in the user's own voice, vocabulary, and reasoning style - because research shows that distanced self-talk (speaking to yourself as a separate person) dramatically reduces anxiety, regulates emotions, and builds self-compassion.

The user imports their WhatsApp messages, ChatGPT conversation exports, and Claude.ai exports, answers a set of guided reflection questions, and records 60 seconds of their voice. Mirror processes all of this through an AI pipeline to build a persona that genuinely sounds and reasons like them - then makes it available as a voice conversation they can have anytime, anywhere.

## **Key Facts at a Glance**

| **Attribute**       | **Detail**                                                      |
| ------------------- | --------------------------------------------------------------- |
| **Product Name**    | Mirror                                                          |
| **Category**        | AI Mental Wellness / Self-Care                                  |
| **Core Technology** | Claude API + ElevenLabs Voice Clone + ChromaDB + OpenAI Whisper |
| **Frontend**        | React 18 + Vite + Tailwind CSS                                  |
| **Backend**         | FastAPI (Python) + Supabase                                     |
| **Vector DB**       | ChromaDB (embedded, free, zero infra)                           |
| **Hackathon Cost**  | Under \$2 for full demo                                         |
| **Build Time**      | 48 hours (full MVP)                                             |

# **2\. The Problem - Why This Matters**

## **2.1 The Mental Health Crisis Is Getting Worse**

The global mental health crisis is accelerating. According to the World Health Organization, 1 in 4 people globally will be affected by a mental health disorder at some point in their lives. Depression is the leading cause of disability worldwide, and anxiety disorders affect 284 million people. Despite growing awareness, the treatment gap - the percentage of people who need care but don't receive it - remains above 75% in most countries.

The reasons are structural: there are not enough therapists. The average wait time to see a mental health professional in the United States is 25 days. In rural areas, the wait can stretch to months. Even in major cities, the average cost of a therapy session is \$150-\$300 per hour, which places it out of reach for the majority of people who need it.

## **2.2 The Existing Solutions Are Broken**

The mental health app market is worth \$5.8 billion and growing at 16% annually - and yet the most used products fail their users in fundamental ways:

- Generic chatbots (Woebot, Wysa): Use scripted CBT exercises that feel mechanical. The responses are templated, the advice is the same for everyone, and users report feeling like they are talking to a FAQ page, not a person who understands them.
- Companion AI (Replika): Designed to simulate friendship, not facilitate self-understanding. Users report unhealthy emotional dependency and the company has had significant issues with boundaries and inappropriate responses.
- Meditation apps (Calm, Headspace): Excellent for stress management but passive. They do not engage with the specific thoughts and worries a person is carrying right now.
- BetterHelp and online therapy platforms: Still expensive (\$240-\$360/month), still require scheduling, still have waiting lists, and still cannot be accessed at 2am when someone most needs support.
- ChatGPT and Claude: Knowledgeable but generic. They do not know you. They give the same response to everyone. The advice is technically sound but emotionally flat because the model has no understanding of who you specifically are.

## **2.3 The Insight That Changes Everything**

Decades of psychological research converge on a counterintuitive finding: the best person to talk you through a hard moment is you - a version of yourself with some emotional distance. When we advise ourselves in the first person ("I am so stupid"), we activate the same stress response as the original crisis. When we talk to ourselves in the third person, or from the perspective of a slightly removed self, we regulate emotions far more effectively.

| **KEY FINDING** | Dr. Ethan Kross at the University of Michigan found that distanced self-talk reduces emotional reactivity, improves performance under stress, and increases self-compassion - all without the effort of traditional therapy exercises. |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

Kristin Neff's self-compassion research adds another dimension: when asked to give advice to a friend in the same situation they face themselves, people are measurably kinder, more rational, and more helpful. We are our own harshest critics - but we are incredibly good at caring for others. Mirror exploits this gap. It creates a version of you that can talk to you the way you would talk to your best friend.

## **2.4 Problem Statement (One Sentence)**

_People in emotional distress need personalized, immediate, affordable support - and every existing solution is either too expensive, too generic, too slow, or too dependent on human availability._

# **3\. The Solution - What Mirror Does**

## **3.1 The Core Concept**

Mirror creates an AI persona that is built entirely from your own data - your words, your voice, your values, your reasoning patterns. Unlike a generic chatbot, Mirror responds the way you would respond to your best friend if they came to you with the same problem you're facing right now. It uses your vocabulary, your sense of humor (if you have one), your communication style, and the beliefs you have explicitly stated about how to handle hard times.

The persona is always available, costs a fraction of therapy, and is tailored to one person: you. The conversation feels uncanny because it is - it sounds like talking to the version of yourself that handles things well.

## **3.2 How It Works - User Journey**

- ONBOARDING (15 minutes): The user imports their data - WhatsApp chat export (.txt), ChatGPT export (conversations.json), Claude export (conversations.json). They record a 60-second voice note. They answer 7 guided reflection questions about their values, coping style, and how they talk to friends in distress.
- PERSONA GENERATION (2-3 minutes): Mirror's AI pipeline parses, chunks, and embeds the imported data into ChromaDB. Claude then analyzes a sample of the user's messages and reflection answers to generate a Personality Fingerprint - a rich system prompt that captures tone, vocabulary, reasoning style, emotional range, humor, and beliefs.
- VOICE CLONING (instant): ElevenLabs clones the user's voice from their 60-second recording. All future responses from Mirror will be spoken in this voice.
- SESSION (ongoing): The user opens Mirror and selects a mode - Vent, Reframe, or Boost. They speak or type. Mirror retrieves relevant chunks from their data, constructs a context-rich prompt, calls Claude, streams the response, and synthesizes it as audio in their cloned voice. They literally hear themselves talking to themselves.
- POST-SESSION: Mirror generates a short journal entry summarizing what was discussed and what shifted. The user rates their mood before and after. Over time, the Insights Dashboard shows patterns.

## **3.3 The Three Modes**

| **Mode** | **What It Does**                                                                                                                                        | **When to Use It**                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| VENT     | No advice. Mirror only reflects, names emotions, and asks gentle open questions. It does not try to fix anything.                                       | When you just need to be heard. When advice would feel invalidating.          |
| REFRAME  | Mirror gently challenges distorted thinking using the user's own stated values from onboarding. Not generic CBT - your actual beliefs about hard times. | When you're stuck in a thought loop. When you need help seeing another angle. |
| BOOST    | Short, energizing responses. Ends with a grounding statement you can say out loud. Higher confidence, higher energy.                                    | Before a hard conversation, a job interview, a presentation, or a first date. |

# **4\. Research Foundation**

## **4.1 Distanced Self-Talk (Ethan Kross, University of Michigan)**

Dr. Ethan Kross and colleagues published a landmark paper in 2014 showing that shifting the perspective of internal monologue from first-person ("Why am I so anxious?") to second/third-person ("Why are you anxious?") produces measurable reductions in emotional reactivity and rumination. Participants who used distanced self-talk performed better on social challenges, recovered from negative events faster, and showed lower physiological stress markers (cortisol levels).

In his book "Chatter," Kross further argues that the inner voice - the relentless internal monologue - is one of the biggest sources of human suffering, but it can be retrained through distancing techniques. Mirror is the technological implementation of this insight at scale.

## **4.2 Self-Compassion Research (Kristin Neff, UT Austin)**

Neff's research consistently shows that the advice we give to others is measurably superior to the advice we give ourselves when facing identical problems. This is because self-criticism activates the threat defense system (fight/flight), while self-compassion activates the care and soothing system. Mirror exploits this by turning the user into the advisor and the person being advised simultaneously - using the emotional distance of the AI persona to bypass self-critical defaults.

## **4.3 The Proteus Effect & Persona Influence**

Research by Jeremy Bailenson at Stanford's Virtual Human Interaction Lab shows that the avatar or persona people use to interact with technology has measurable effects on their behavior and self-perception. When people interact with a confident version of themselves, they exhibit more confident behavior in reality. Mirror's persona is explicitly designed to represent the user at their most grounded, wise, and self-compassionate - with the expectation that this influences their actual self-perception over time.

## **4.4 Voice-Based Emotional Processing**

Voice has a unique emotional channel that text lacks. The prosody (rhythm, pitch, speed) of speech carries emotional information that the brain processes differently than written words. When Mirror responds in the user's own cloned voice, it creates a powerful uncanny valley effect that tricks the brain into processing the advice as internal - as coming from within - rather than from an external source. This is why the voice clone is not optional: it is the core mechanism of why Mirror works differently than any text-based chatbot.

## **4.5 RAG as Long-Term Memory for Emotional Context**

Retrieval-Augmented Generation allows Mirror to pull specific memories, opinions, and statements from the user's data at conversation time. This means Mirror does not just know the user's general personality - it can surface the specific thing they wrote three months ago about how they feel about failure, or the specific joke they use to defuse tension, or the specific belief they hold about asking for help. This level of contextual specificity is what separates Mirror from every other mental wellness tool.

# **5\. Target Audience & User Personas**

## **5.1 Primary Market**

Mirror's primary market is adults aged 18-35 who are digitally native, experience moderate anxiety or stress, are aware of mental health but face barriers to professional therapy (cost, time, stigma, waitlists), and are already using AI tools like ChatGPT or Claude in their daily lives. This demographic is uniquely positioned because they have the data exports available (they already use ChatGPT and WhatsApp) and the technical comfort to onboard.

## **5.2 User Personas**

### **Persona 1 - The Overloaded Professional ("Alex, 28, Software Engineer")**

Alex works 50-hour weeks, has a good salary but no time. Therapy costs \$200/session and requires booking 2 weeks in advance. Alex experiences imposter syndrome, occasional burnout, and difficulty switching off. Alex has extensive ChatGPT and Claude exports because he uses AI for work daily. Mirror is a 10-minute wind-down tool - talking through the day before bed, preparing for a difficult conversation with a manager, or processing a code review that felt like a personal attack.

### **Persona 2 - The College Student ("Maya, 21, Psychology Major")**

Maya is aware of mental health, takes it seriously, but cannot afford regular therapy on a student budget. She has anxiety around exams, relationships, and the future. She uses WhatsApp constantly with her friends. Mirror fills the gap between her friend group (who she does not want to burden) and a therapist (whom she cannot afford). She is most likely to use Vent mode and journal features.

### **Persona 3 - The Post-Breakup Processor ("Jordan, 32, Marketing Manager")**

Jordan is going through a major life transition - divorce, breakup, job loss, relocation. They need to process intense emotions on demand, not on a therapist's schedule. They have tried journaling but find it too passive. Mirror's voice conversation feels more like actually working through something than writing into a void. Jordan is the highest engagement user - multiple sessions per day during the acute phase, tapering to weekly as they stabilize.

### **Persona 4 - The Performance Optimizer ("Priya, 25, Pre-Med Student")**

Priya uses Boost mode before every exam, MCAT practice session, and residency interview. She does not think of Mirror as therapy - she thinks of it as a mental warm-up. She records herself talking through her anxieties and then listens to Mirror's grounded, confident response in her own voice. It functions like a coach that knows her specific fears and speaks her specific language.

## **5.3 Total Addressable Market**

| **Segment**                          | **Size**                   | **Rationale**            |
| ------------------------------------ | -------------------------- | ------------------------ |
| Total mental wellness app market     | \$5.8B globally            | Industry reports 2024    |
| AI-native adults 18-35 with anxiety  | ~180M in US+EU             | WHO + Pew Research       |
| Unmet therapy demand (treatment gap) | 75% of those who need care | WHO treatment gap data   |
| Serviceable target (yr 1)            | ~2M users                  | ChatGPT/WhatsApp overlap |

# **6\. Competitive Landscape**

## **6.1 Competitor Analysis**

| **Product** | **Category**   | **Cost**     | **Key Weakness**                                     | **How Mirror Wins**                                            |
| ----------- | -------------- | ------------ | ---------------------------------------------------- | -------------------------------------------------------------- |
| Replika     | AI companion   | Free/\$10/mo | Generic, dependency-forming, no real-world grounding | Mirror uses your real data and voice - not a fictional persona |
| Woebot      | CBT chatbot    | \$99/mo      | Scripted, impersonal, no voice                       | Mirror adapts to your vocabulary and personality               |
| BetterHelp  | Online therapy | \$240-360/mo | Expensive, scheduled, not available 24/7             | Mirror is instant, 24/7, and \$10-15/mo                        |
| ChatGPT     | General AI     | Free/\$20/mo | Knows nothing about you specifically                 | Mirror is built from your personal data                        |
| Calm        | Meditation     | \$70/yr      | Passive, no personalization, no conversation         | Mirror is interactive and responsive                           |

## **6.2 Mirror's Unfair Advantage**

- Data moat: Once a user's persona is built from their personal data, switching costs are extremely high. Their WhatsApp history, voice clone, and reflection answers live only in Mirror.
- Voice differentiation: No competitor uses the user's own voice to respond. This is psychologically distinct from text - the brain processes it as internal dialogue, not external advice.
- Research-backed positioning: Mirror can point to 20 years of academic research supporting the efficacy of distanced self-talk. Replika cannot. Woebot can claim CBT credentials but not the personalization angle.
- Flywheel effect: Every session adds data. The more Mirror knows, the better it responds. The persona improves over time as the user adds more conversations.

# **7\. Product Features - Complete List**

## **7.1 Core Features (MVP - Must Have for Hackathon)**

| **#** | **Feature**                  | **Description**                                                                                                                                                                                               | **Tech**                   |
| ----- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 1     | **Multi-source Ingestion**   | Import WhatsApp .txt, ChatGPT conversations.json, Claude conversations.json, and direct text paste. Each source is parsed, cleaned, chunked, and embedded separately with source metadata tags.               | Python parsers + ChromaDB  |
| 2     | **Reflection Questionnaire** | 7 guided questions during onboarding that capture the user's values, coping style, self-compassion approach, and conversational patterns. Answers go directly into the base system prompt, not the vector DB. | React form + Supabase      |
| 3     | **Voice Recording & Clone**  | User records 60 seconds of natural speech. Audio sent to ElevenLabs voice cloning API. Voice ID stored against user profile. All future responses synthesized in this voice.                                  | MediaRecorder + ElevenLabs |
| 4     | **Persona Generation**       | One-time Claude call analyzes 80 representative message chunks and all reflection answers to produce a 400-word Personality Fingerprint stored as the system prompt base.                                     | claude-sonnet-4-6          |
| 5     | **RAG Chat Pipeline**        | Every user message triggers: embed query → ChromaDB similarity search → top-5 chunk retrieval → inject as context → Claude API call → SSE stream response.                                                    | ChromaDB + Claude API      |
| 6     | **Voice Input (STT)**        | Push-to-talk button. MediaRecorder captures audio, sends to FastAPI, which calls OpenAI Whisper. Transcription returned and used as the chat message.                                                         | Whisper API                |
| 7     | **Voice Output (TTS)**       | Claude's streaming text response is buffered into sentence chunks. Each complete sentence is sent to ElevenLabs streaming TTS and played via Web Audio API.                                                   | ElevenLabs streaming       |
| 8     | **Three Session Modes**      | Vent, Reframe, Boost. Mode selection changes the system prompt behavior rules injected into every Claude call.                                                                                                | React UI + prompt          |
| 9     | **Crisis Detection**         | Lightweight pre-check on every user message using claude-haiku. If crisis signals detected, persona breaks, 988 resources surface, session pauses.                                                            | claude-haiku-4-5           |
| 10    | **Mood Check-in**            | 1-5 slider before and after session. Score stored with timestamp in Supabase.                                                                                                                                 | React + Supabase           |
| 11    | **Pre-Session Intention**    | One-sentence text field: "What do you want from this session?" Injected into Claude context as session goal.                                                                                                  | React + prompt injection   |
| 12    | **Session Summary**          | Post-session Claude call reads conversation and generates 3-4 sentence journal entry. Stored in Supabase journal table.                                                                                       | claude-sonnet-4-6          |
| 13    | **Insights Dashboard**       | Charts showing mood over time (Recharts), sessions by mode, recurring themes. Built from Supabase data.                                                                                                       | Recharts + Supabase        |
| 14    | **Guided Onboarding Flow**   | Step-by-step UI walking user through each onboarding stage with intent explanations at each step.                                                                                                             | React multi-step form      |

# **8\. Frontend Design & Architecture**

## **8.1 Technology Stack**

- React 18 with hooks (useState, useEffect, useCallback, useRef)
- Vite 5 as the build tool and dev server (replaces Create React App, much faster)
- React Router v6 for client-side routing
- Tailwind CSS for styling via PostCSS
- Axios for HTTP requests to FastAPI
- Recharts for mood and insight data visualization
- Web Audio API (native browser) for audio playback
- MediaRecorder API (native browser) for voice capture

## **8.2 Screen Map**

| **Screen**            | **Route**           | **Purpose**                                |
| --------------------- | ------------------- | ------------------------------------------ |
| **Landing Page**      | /                   | Marketing page, sign up / log in CTA       |
| **Sign Up / Log In**  | /auth               | Supabase Auth UI                           |
| **Onboarding Step 1** | /onboard/import     | File upload for data sources               |
| **Onboarding Step 2** | /onboard/voice      | Record 60-second voice sample              |
| **Onboarding Step 3** | /onboard/reflect    | 7 reflection questions                     |
| **Onboarding Step 4** | /onboard/generating | Loading screen while persona builds        |
| **Dashboard / Home**  | /home               | Start session, view recent sessions        |
| **Session**           | /session            | Main voice/text chat UI with mode selector |
| **Journal**           | /journal            | List of session summaries with timeline    |
| **Insights**          | /insights           | Recharts dashboard of mood + usage data    |
| **Settings**          | /settings           | Re-record voice, update preferences        |

## **8.3 Component Architecture**

### **8.3.1 Session.jsx - The Heart of the App**

This is the most complex component. It manages:

- Mode state (vent | reframe | boost)
- Pre-session intention text
- Conversation history array (array of {role, content} objects)
- Voice recording state via useVoiceInput hook
- SSE connection for streaming Claude responses
- Audio queue for sentence-chunked ElevenLabs playback via useAudioPlayer hook
- Crisis detection overlay (conditional render)
- Mood check-in modal before/after session

### **8.3.2 Key Custom Hooks**

useVoiceInput.js - wraps MediaRecorder API

\- startRecording(): initializes MediaRecorder, starts capturing

\- stopRecording(): stops capture, packages blob, sends to /api/voice/transcribe

\- returns { isRecording, transcript, error }

useAudioPlayer.js - Web Audio API audio queue

\- enqueueChunk(audioBlob): adds audio to ordered queue

\- manages playback so chunks play in correct order

\- returns { isPlaying, currentChunk }

### **8.3.3 Onboarding Multi-Step Form**

The onboarding flow is a single-page multi-step form tracked with a step index in local state. Each step renders a different child component. Progress is saved to Supabase after each step completion so the user can resume if interrupted.

## **8.4 Styling System**

Tailwind CSS with a custom color extension in tailwind.config.js. The Mirror brand palette uses deep purple as the primary color, soft lavender for backgrounds, and neutral grays for text. Typography uses Inter as the primary font (imported via Google Fonts in index.html).

## **8.5 State Management**

For a hackathon, global state is managed via React Context - no Redux or Zustand needed. Two contexts:

- AuthContext: user session, Supabase auth state, user profile
- CloneContext: persona metadata, voice ID, mode preference

## **8.6 Critical Vite Configuration**

// vite.config.js

export default {

plugins: \[react()\],

server: {

proxy: {

'/api': {

target: '<http://localhost:8000>',

changeOrigin: true,

}

}

}

}

The proxy configuration means all /api/\* calls from the React app route to FastAPI on port 8000 without CORS issues in development. In production, you set the VITE_API_URL environment variable.

# **9\. Backend Design & Architecture**

## **9.1 Technology Stack**

- FastAPI (Python 3.11+) - async-first, built-in OpenAPI docs, excellent for streaming responses
- Uvicorn - ASGI server for FastAPI
- Supabase - Postgres database + authentication + file storage
- ChromaDB - embedded vector database (runs in the same process as FastAPI, no separate server)
- Anthropic Python SDK - for Claude API calls
- OpenAI Python SDK - for Whisper STT and text-embedding-3-small
- ElevenLabs Python SDK - for voice cloning and streaming TTS
- python-multipart - for handling file uploads
- sse-starlette - for Server-Sent Events streaming to the frontend

## **9.2 Router Structure**

| **Router File**         | **Prefix** | **Endpoints**                                                           |
| ----------------------- | ---------- | ----------------------------------------------------------------------- |
| **routers/auth.py**     | /auth      | POST /signup, POST /login, POST /logout, GET /me                        |
| **routers/ingest.py**   | /ingest    | POST /upload (file), POST /questions (reflection), GET /status/{job_id} |
| **routers/persona.py**  | /persona   | POST /generate, GET /{clone_id}, PATCH /{clone_id}                      |
| **routers/chat.py**     | /chat      | POST /message (SSE stream), GET /history/{session_id}                   |
| **routers/voice.py**    | /voice     | POST /transcribe (Whisper), POST /synthesize (ElevenLabs), POST /clone  |
| **routers/session.py**  | /session   | POST /start, POST /end, GET /list, GET /{session_id}                    |
| **routers/journal.py**  | /journal   | GET /list, GET /{entry_id}, POST /generate                              |
| **routers/insights.py** | /insights  | GET /mood, GET /usage, GET /themes                                      |

## **9.3 The Chat Endpoint - Most Critical Code**

POST /chat/message returns an EventSource stream. Here is the complete logic:

\# Step 1: Run crisis check FIRST using haiku (fast, cheap)

crisis_result = await crisis_service.check(user_message)

if crisis_result.is_crisis:

yield crisis_response_event()

return

\# Step 2: Embed the user message

query_vector = openai_embed(user_message)

\# Step 3: Retrieve relevant chunks from ChromaDB

results = chroma_collection.query(

query_embeddings=\[query_vector\],

n_results=5,

where={"clone_id": clone_id}

)

\# Step 4: Weight reflection chunks higher

context = rerank_by_source(results)

\# Step 5: Build system prompt from persona + mode + context

system = build_system_prompt(persona, mode, context, intention)

\# Step 6: Stream from Claude

async with anthropic.messages.stream(

model="claude-sonnet-4-6",

max_tokens=1000,

system=system,

messages=conversation_history,

) as stream:

sentence_buffer = ""

async for text in stream.text_stream:

sentence_buffer += text

yield SSE_text_event(text) # stream to frontend

\# When sentence complete, fire to ElevenLabs

if is_sentence_end(sentence_buffer):

audio = await elevenlabs.synthesize(sentence_buffer, voice_id)

yield SSE_audio_event(audio)

sentence_buffer = ""

## **9.4 CORS Configuration**

Add this to main.py on day one - without it, the React app on port 5173 will be blocked by the browser from reaching FastAPI on port 8000:

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(

CORSMiddleware,

allow_origins=\["<http://localhost:5173>", os.getenv("FRONTEND_URL")\],

allow_credentials=True,

allow_methods=\["\*"\],

allow_headers=\["\*"\],

)

# **10\. AI Layer - Claude, Whisper, ElevenLabs**

## **10.1 Claude API - Three Distinct Roles**

### **Role 1: Persona Generation (runs once per user)**

Model: claude-sonnet-4-6. Called once during onboarding after all data is ingested. Receives up to 80 representative message chunks + all 7 reflection answers. Produces a 400-word Personality Fingerprint written as a second-person system prompt: "You are a clone of \[name\]. You communicate with..."

The prompt instructs Claude to extract: tone and energy level, vocabulary patterns and phrases, how they structure explanations, humor style, emotional expression range, deeply held beliefs about hard times, how they handle uncertainty, and their typical sentence length and punctuation style.

### **Role 2: Chat (runs every message)**

Model: claude-sonnet-4-6. The system prompt is: \[Personality Fingerprint\] + \[Mode-specific behavior rules\] + \[Pre-session intention\] + \[Top-5 RAG chunks\]. The conversation_history array carries the last 8 turns. Temperature: 0.75 for Vent, 0.5 for Reframe, 0.8 for Boost.

### **Role 3: Session Summary (runs once after session ends)**

Model: claude-sonnet-4-6. Reads the full session conversation and produces a 3-4 sentence journal entry: what was discussed, what shifted emotionally, one thing to carry forward. Stored to Supabase journal table.

### **Role 4: Crisis Detection (runs before every chat call)**

Model: claude-haiku-4-5-20251001. Single fast call: "Does this message contain any signals of suicidal ideation, self-harm, or acute mental health crisis? Reply only JSON: {is_crisis: bool, confidence: 0-1}". If is_crisis is true and confidence > 0.7, abort the normal flow and surface crisis resources.

## **10.2 The Personality Fingerprint Prompt**

You are a clone of the user. Based on the messages below,

extract their communication persona in detail.

Messages:

{sample_text}

Reflection answers:

{reflection_answers}

Return a persona profile as a second-person system prompt starting

with "You are a clone of \[name\]." covering:

1\. Tone and energy (formal/casual/warm/direct)

2\. Exact vocabulary patterns and phrases they use

3\. How they structure explanations (lists vs stories vs questions)

4\. Humor style if any

5\. Topics they care deeply about

6\. How they handle disagreement, uncertainty, and failure

7\. What they believe about asking for help

8\. What they would say to a close friend in distress

Use their actual phrases as examples. Keep it under 400 words.

This will be the system prompt for every conversation.

## **10.3 Mode-Specific Prompt Extensions**

### **Vent Mode**

CURRENT MODE: VENT

Rules:

\- Do not give advice. Do not try to fix anything.

\- Only reflect feelings back. Ask gentle open questions.

\- If they share something painful, name the emotion first.

\- Never say "at least" or "but think about it this way."

\- Keep responses short. Presence over productivity.

### **Reframe Mode**

CURRENT MODE: REFRAME

Rules:

\- After validating feelings, gently challenge distorted thinking.

\- Use the user's OWN stated beliefs (from context) to challenge,

not generic CBT scripts.

\- Ask "What would you tell your friend Maya in this situation?"

\- Never invalidate. Always validate first, then expand perspective.

### **Boost Mode**

CURRENT MODE: BOOST

Rules:

\- Keep responses short and energizing.

\- End EVERY response with a grounding statement they can say aloud.

\- Match their confidence, not their anxiety.

\- Remind them of a past win if relevant context is available.

## **10.4 ElevenLabs Voice Pipeline**

During onboarding, the user's 60-second voice recording is sent to ElevenLabs' voice cloning endpoint (/v1/voices/add). The returned voice_id is stored in the user's Supabase profile.

During chat, Mirror detects sentence boundaries in the Claude stream by watching for a terminal punctuation character (. ? !) followed by a space or end-of-token, with a minimum buffer of 30 characters. On detection, the sentence chunk is dispatched to ElevenLabs' streaming TTS endpoint (/v1/text-to-speech/{voice_id}/stream), and the returned audio chunk is base64-encoded and sent to the frontend via the existing SSE channel as a separate event type (type: "audio").

The frontend's useAudioPlayer hook maintains an ordered queue. Audio chunks are enqueued as they arrive and played sequentially via the Web Audio API. This ensures sentence order is preserved even if ElevenLabs returns chunk 2 before chunk 1 finishes synthesizing.

## **10.5 OpenAI Whisper (Speech to Text)**

Voice input flow: MediaRecorder captures audio as a WebM/OGG blob. The blob is sent to POST /voice/transcribe as a multipart form upload. FastAPI receives it, writes to a temp file, and calls openai.audio.transcriptions.create(model="whisper-1", file=temp_file). The returned transcript string is then used as the chat message exactly as if the user had typed it.

# **11\. Database Design**

## **11.1 Supabase Tables**

### **users table**

| **Column**              | **Type**  | **Notes**                                    |
| ----------------------- | --------- | -------------------------------------------- |
| **id**                  | UUID (PK) | Supabase auth user ID                        |
| **email**               | TEXT      | From Supabase auth                           |
| **voice_id**            | TEXT      | ElevenLabs voice_id after cloning            |
| **persona_prompt**      | TEXT      | 400-word personality fingerprint from Claude |
| **onboarding_complete** | BOOLEAN   | True after all 4 onboarding steps done       |
| **mode_preference**     | TEXT      | Default mode: vent \| reframe \| boost       |
| **created_at**          | TIMESTAMP | Auto-set on insert                           |

### **sessions table**

| **Column**      | **Type**  | **Notes**                           |
| --------------- | --------- | ----------------------------------- |
| **id**          | UUID (PK) | Auto-generated                      |
| **user_id**     | UUID (FK) | References users.id                 |
| **mode**        | TEXT      | vent \| reframe \| boost            |
| **intention**   | TEXT      | Pre-session intention text          |
| **mood_before** | INTEGER   | 1-5 scale                           |
| **mood_after**  | INTEGER   | 1-5 scale, set on session end       |
| **messages**    | JSONB     | Array of {role, content, timestamp} |
| **summary**     | TEXT      | Claude-generated journal entry      |
| **started_at**  | TIMESTAMP |                                     |
| **ended_at**    | TIMESTAMP | Null until session ends             |

### **mood_logs table**

| **Column**      | **Type**  | **Notes**       |
| --------------- | --------- | --------------- |
| **id**          | UUID (PK) |                 |
| **user_id**     | UUID (FK) |                 |
| **session_id**  | UUID (FK) |                 |
| **score**       | INTEGER   | 1-5             |
| **type**        | TEXT      | before \| after |
| **recorded_at** | TIMESTAMP |                 |

## **11.2 ChromaDB Collections**

ChromaDB runs embedded (in-process with FastAPI) using a persistent directory. No separate server, no Docker. One collection: "mirror_chunks".

\# Each document in the collection has:

document = "the actual text chunk (200-400 tokens)"

embedding = \[... 1536-dimensional vector ...\]

metadata = {

"user_id": "uuid",

"source": "whatsapp | chatgpt | claude | reflection",

"chunk_index": 42,

"date_approx": "2024-Q3",

"weight": 1.0 # reflection chunks get 2.0

}

# **12\. Data Ingestion Pipeline**

## **12.1 Pipeline Overview**

The ingestion pipeline runs after the user completes the file upload step. It is triggered by POST /ingest/upload and runs as a background task (FastAPI BackgroundTasks). The frontend polls GET /ingest/status/{job_id} every 2 seconds to show progress.

- File received → stored temporarily in /tmp/
- Source detected (whatsapp | chatgpt | claude)
- Parser runs → extracts user-only messages as list of strings
- Chunks created → 300-token overlapping windows
- Each chunk embedded via OpenAI text-embedding-3-small
- Vectors inserted into ChromaDB with source metadata
- Job status updated to "complete" in Supabase

## **12.2 WhatsApp Parser**

WhatsApp exports a .txt file. Format: "DD/MM/YYYY, HH:MM - ContactName: Message text". The parser:

import re

PATTERN = r"^\\d{1,2}/\\d{1,2}/\\d{2,4},\\s\\d{1,2}:\\d{2}\\s-\\s(.+?):\\s(.+)\$"

def parse_whatsapp(file_text: str, user_name: str) -> list\[str\]:

messages = \[\]

for line in file_text.splitlines():

match = re.match(PATTERN, line)

if match:

sender, text = match.group(1), match.group(2)

if sender == user_name and text != "&lt;Media omitted&gt;":

if len(text) > 15: # skip very short messages

messages.append(text)

return messages

## **12.3 ChatGPT Export Parser**

ChatGPT exports a conversations.json file. It is a list of conversation objects, each with a mapping dict of message nodes. User messages have author.role == "user".

import json

def parse_chatgpt(file_text: str) -> list\[str\]:

data = json.loads(file_text)

messages = \[\]

for conversation in data:

mapping = conversation.get("mapping", {})

for node in mapping.values():

msg = node.get("message")

if not msg: continue

if msg\["author"\]\["role"\] != "user": continue

content = msg.get("content", {})

parts = content.get("parts", \[\])

for part in parts:

if isinstance(part, str) and len(part) > 30:

messages.append(part)

return messages

## **12.4 Claude Export Parser**

Claude.ai exports a conversations.json with a similar structure. User messages have role == "human" or sender == "human".

def parse_claude_export(file_text: str) -> list\[str\]:

data = json.loads(file_text)

messages = \[\]

for conversation in data:

for msg in conversation.get("messages", \[\]):

if msg.get("sender") == "human":

text = msg.get("text", "")

if len(text) > 30:

messages.append(text)

return messages

## **12.5 Chunking Strategy**

After parsing, all messages are concatenated into a single text corpus per source. The corpus is split into overlapping chunks of approximately 300 tokens (roughly 200-250 words) with a 50-token overlap between consecutive chunks. This overlap ensures that context at chunk boundaries is not lost.

def chunk_text(text: str, chunk_size=300, overlap=50) -> list\[str\]:

words = text.split()

chunks = \[\]

i = 0

while i < len(words):

chunk = " ".join(words\[i:i+chunk_size\])

chunks.append(chunk)

i += chunk_size - overlap

return chunks

# **13\. Complete File & Folder Structure**

mirror/

├── frontend/ ← React + Vite

│ ├── public/

│ │ └── mirror-logo.svg

│ ├── src/

│ │ ├── pages/

│ │ │ ├── Landing.jsx ← marketing/CTA page

│ │ │ ├── Auth.jsx ← login/signup

│ │ │ ├── onboarding/

│ │ │ │ ├── OnboardLayout.jsx ← progress bar wrapper

│ │ │ │ ├── Step1Import.jsx ← file upload

│ │ │ │ ├── Step2Voice.jsx ← 60s voice record

│ │ │ │ ├── Step3Reflect.jsx ← 7 questions

│ │ │ │ └── Step4Generating.jsx ← loading/progress

│ │ │ ├── Home.jsx ← dashboard/start session

│ │ │ ├── Session.jsx ← CORE: chat + voice UI

│ │ │ ├── Journal.jsx ← session summaries

│ │ │ ├── Insights.jsx ← recharts dashboard

│ │ │ └── Settings.jsx

│ │ ├── components/

│ │ │ ├── VoiceButton.jsx ← push-to-talk

│ │ │ ├── ChatBubble.jsx ← message display

│ │ │ ├── ModeSelector.jsx ← vent/reframe/boost

│ │ │ ├── MoodSlider.jsx ← 1-5 rating

│ │ │ ├── IntentionInput.jsx ← pre-session text

│ │ │ ├── CrisisOverlay.jsx ← crisis resources modal

│ │ │ ├── MoodChart.jsx ← recharts line chart

│ │ │ └── SessionCard.jsx ← journal entry preview

│ │ ├── hooks/

│ │ │ ├── useVoiceInput.js ← MediaRecorder wrapper

│ │ │ ├── useAudioPlayer.js ← Web Audio queue

│ │ │ └── useSSE.js ← EventSource wrapper

│ │ ├── context/

│ │ │ ├── AuthContext.jsx

│ │ │ └── CloneContext.jsx

│ │ ├── api/

│ │ │ └── client.js ← axios instance + all calls

│ │ ├── App.jsx ← router setup

│ │ ├── main.jsx

│ │ └── index.css ← tailwind directives

│ ├── vite.config.js

│ ├── tailwind.config.js

│ └── package.json

│

└── backend/ ← FastAPI

├── main.py ← app init, middleware, routers

├── routers/

│ ├── auth.py

│ ├── ingest.py

│ ├── persona.py

│ ├── chat.py ← CORE: SSE streaming

│ ├── voice.py

│ ├── session.py

│ ├── journal.py

│ └── insights.py

├── services/

│ ├── parsers.py ← WhatsApp/ChatGPT/Claude

│ ├── chunker.py

│ ├── embedder.py ← OpenAI embeddings

│ ├── chroma_client.py ← ChromaDB singleton

│ ├── rag.py ← retrieval + reranking

│ ├── persona_generator.py ← Claude persona call

│ ├── crisis_detector.py ← haiku crisis check

│ ├── session_summarizer.py ← post-session journal

│ └── prompt_builder.py ← assemble system prompt

├── models.py ← Pydantic schemas

├── config.py ← env vars

├── chroma_data/ ← ChromaDB persists here

├── .env

└── requirements.txt

# **14\. Step-by-Step Build Instructions**

## **14.1 Prerequisites - Install Before You Start**

- Node.js 20+ (check: node --version)
- Python 3.11+ (check: python --version)
- Git
- A code editor (VS Code recommended)
- Accounts needed: Anthropic (claude.ai/api), OpenAI (platform.openai.com), ElevenLabs (elevenlabs.io), Supabase (supabase.com) - all have free tiers

## **14.2 Step 1 - Project Setup (30 minutes)**

### **1.1 Create the repo and folder structure**

mkdir mirror && cd mirror

git init

### **1.2 Bootstrap the React + Vite frontend**

npm create vite@latest frontend -- --template react

cd frontend

npm install

npm install react-router-dom axios recharts

npm install -D tailwindcss @tailwindcss/vite

### **1.3 Initialize Tailwind**

npx tailwindcss init -p

In tailwind.config.js, set content to \["./src/\*\*/\*.{js,jsx}"\]. In src/index.css add @tailwind base; @tailwind components; @tailwind utilities;

### **1.4 Bootstrap the FastAPI backend**

cd ../

mkdir backend && cd backend

python -m venv venv

source venv/bin/activate # Mac/Linux

venv\\Scripts\\activate # Windows

pip install fastapi uvicorn python-dotenv anthropic openai

pip install elevenlabs chromadb supabase python-multipart

pip install sse-starlette httpx

### **1.5 Set up Supabase**

Go to supabase.com, create a new project. In the SQL editor, run the table creation scripts from Section 11. Copy your project URL and anon key to backend/.env:

SUPABASE_URL=<https://your-project.supabase.co>

SUPABASE_KEY=your-anon-key

ANTHROPIC_API_KEY=sk-ant-...

OPENAI_API_KEY=sk-...

ELEVENLABS_API_KEY=...

## **14.3 Step 2 - Backend Foundation (1 hour)**

### **2.1 Create main.py**

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from routers import auth, ingest, persona, chat, voice, session, journal, insights

import os

app = FastAPI(title="Mirror API")

app.add_middleware(CORSMiddleware,

allow_origins=\["<http://localhost:5173"\>],

allow_credentials=True, allow_methods=\["\*"\], allow_headers=\["\*"\])

app.include_router(auth.router, prefix="/auth")

app.include_router(ingest.router, prefix="/ingest")

app.include_router(chat.router, prefix="/chat")

app.include_router(voice.router, prefix="/voice")

app.include_router(session.router, prefix="/session")

\# Start server: uvicorn main:app --reload --port 8000

### **2.2 Create services/chroma_client.py**

import chromadb

from chromadb.config import Settings

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

## **14.4 Step 3 - Data Ingestion (2 hours)**

Build routers/ingest.py with the upload endpoint and background task. Build services/parsers.py with the three parser functions (Section 12). Build services/chunker.py with the chunking logic. Build services/embedder.py that calls openai.embeddings.create() and inserts into ChromaDB.

Test this step by uploading a WhatsApp export via curl or the FastAPI /docs page and verifying that ChromaDB now has documents in the collection.

## **14.5 Step 4 - Persona Generation (1 hour)**

Build services/persona_generator.py. The function receives the user_id, queries ChromaDB for 80 representative chunks from that user, fetches all reflection answers from Supabase, and calls Claude with the prompt from Section 10.2. Store the returned persona string to users.persona_prompt in Supabase.

## **14.6 Step 5 - Voice Pipeline (2 hours)**

### **5.1 ElevenLabs Voice Cloning Endpoint**

POST /voice/clone receives the audio blob as a file upload. Send it to ElevenLabs:

from elevenlabs.client import ElevenLabs

el = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

async def clone_voice(audio_file, user_name: str) -> str:

response = el.voices.add(

name=f"Mirror-{user_name}",

files=\[audio_file\]

)

return response.voice_id # store this in Supabase

### **5.2 Whisper Transcription Endpoint**

import openai

async def transcribe_audio(audio_file) -> str:

transcript = openai.audio.transcriptions.create(

model="whisper-1",

file=audio_file

)

return transcript.text

## **14.7 Step 6 - Chat with SSE Streaming (3 hours)**

This is the most complex step. Build routers/chat.py with the streaming endpoint.

from fastapi import APIRouter

from fastapi.responses import StreamingResponse

from sse_starlette.sse import EventSourceResponse

router = APIRouter()

@router.post("/message")

async def chat_message(req: ChatRequest):

return EventSourceResponse(generate_response(req))

async def generate_response(req: ChatRequest):

\# 1. Crisis check

crisis = await crisis_detector.check(req.message)

if crisis.is_crisis:

yield {"event": "crisis", "data": "988"}

return

\# 2. Build context

chunks = await rag.retrieve(req.message, req.user_id)

system = prompt_builder.build(req.persona, req.mode, chunks, req.intention)

\# 3. Stream from Claude

sentence_buffer = ""

async with anthropic.messages.stream(

model="claude-sonnet-4-6",

max_tokens=1000,

system=system,

messages=req.history,

) as stream:

async for text in stream.text_stream:

yield {"event": "text", "data": text}

sentence_buffer += text

if text.endswith((".", "?", "!")) and len(sentence_buffer) > 30:

audio = await el.generate(sentence_buffer, req.voice_id)

yield {"event": "audio", "data": base64.b64encode(audio)}

sentence_buffer = ""

## **14.8 Step 7 - Frontend Core (3 hours)**

Build App.jsx with React Router routes. Build AuthContext and CloneContext. Build the Session.jsx page - this is the most important component. Wire up:

- useVoiceInput hook to the VoiceButton component
- useSSE hook to the /chat/message endpoint
- useAudioPlayer hook to play returned audio chunks
- ModeSelector component to session mode state
- MoodSlider component to pre/post session ratings
- CrisisOverlay as a conditional render on crisis SSE event

## **14.9 Step 8 - Onboarding Flow (2 hours)**

Build the 4-step onboarding. Step 1: drag-and-drop file upload with source detection. Step 2: MediaRecorder push-to-talk with 60 second countdown. Step 3: 7 reflection questions as a form with textarea inputs. Step 4: animated progress screen that polls /ingest/status until complete, then triggers persona generation.

## **14.10 Step 9 - Insights Dashboard (1.5 hours)**

Build Insights.jsx using Recharts. Fetch mood_logs from Supabase, render as a LineChart with before/after series. Fetch sessions grouped by mode for a BarChart. Session count and average mood improvement as stat cards at the top.

## **14.11 Step 10 - Deploy (1 hour)**

- Frontend → Vercel: connect GitHub repo, set VITE_API_URL env var to Railway URL, deploy
- Backend → Railway: connect GitHub repo, set all env vars from .env, Railway auto-detects Python and runs uvicorn
- ChromaDB data will need volume persistence on Railway - use a Railway volume mounted at /app/chroma_data

# **15\. API Reference**

## **15.1 Authentication**

| **Method** | **Route**    | **Body**          | **Returns**                                     |
| ---------- | ------------ | ----------------- | ----------------------------------------------- |
| POST       | /auth/signup | {email, password} | {user_id, session_token}                        |
| POST       | /auth/login  | {email, password} | {user_id, session_token}                        |
| GET        | /auth/me     | Bearer token      | {user_id, email, voice_id, onboarding_complete} |

## **15.2 Ingestion**

| **Method** | **Route**           | **Body**                    | **Returns**                                         |
| ---------- | ------------------- | --------------------------- | --------------------------------------------------- |
| POST       | /ingest/upload      | multipart: file, source     | {job_id, status: "processing"}                      |
| GET        | /ingest/status/{id} | -                           | {status: processing\|complete\|error, chunks_added} |
| POST       | /ingest/questions   | {user_id, answers: \[...\]} | {saved: true}                                       |

## **15.3 Persona**

| **Method** | **Route**          | **Body**  | **Returns**                               |
| ---------- | ------------------ | --------- | ----------------------------------------- |
| POST       | /persona/generate  | {user_id} | {persona_prompt: "You are a clone of..."} |
| GET        | /persona/{user_id} | -         | {persona_prompt, voice_id, created_at}    |

## **15.4 Chat (SSE)**

| **Method** | **Route**     | **Body**                                               | **Returns (SSE stream)**                                                                            |
| ---------- | ------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| POST       | /chat/message | {user_id, message, mode, intention, history, voice_id} | SSE events: {event:"text",data:"..."} \| {event:"audio",data:base64} \| {event:"crisis",data:"988"} |

## **15.5 Voice**

| **Method** | **Route**         | **Body**                         | **Returns**             |
| ---------- | ----------------- | -------------------------------- | ----------------------- |
| POST       | /voice/clone      | multipart: audio_file, user_name | {voice_id}              |
| POST       | /voice/transcribe | multipart: audio_file            | {transcript: "text..."} |

## **15.6 Session**

| **Method** | **Route**      | **Body**                                | **Returns**                                                   |
| ---------- | -------------- | --------------------------------------- | ------------------------------------------------------------- |
| POST       | /session/start | {user_id, mode, intention, mood_before} | {session_id}                                                  |
| POST       | /session/end   | {session_id, messages, mood_after}      | {summary, journal_entry_id}                                   |
| GET        | /session/list  | ?user_id=...                            | \[{session_id, mode, mood_before, mood_after, summary, ...}\] |

# **16\. Cost Breakdown**

## **16.1 Per-Session Cost Analysis**

| **Service**                | **Usage Per Session**           | **Unit Cost**        | **Session Cost** |
| -------------------------- | ------------------------------- | -------------------- | ---------------- |
| **Claude Sonnet 4 (chat)** | ~1500 input + 300 output tokens | \$3 / \$15 per MTok  | ~\$0.009         |
| **Claude Haiku (crisis)**  | ~200 input + 10 output tokens   | \$1 / \$5 per MTok   | ~\$0.0003        |
| **OpenAI Whisper (STT)**   | ~60 seconds of audio            | \$0.006/min          | ~\$0.006         |
| **ElevenLabs TTS**         | ~500 characters of output       | \$0.30/1000 chars    | ~\$0.15          |
| **OpenAI Embeddings**      | ~5 query embeds                 | \$0.02/MTok          | ~\$0.0001        |
| **Supabase**               | DB reads/writes                 | Free tier (50k rows) | \$0.00           |
| **ChromaDB**               | Local/embedded                  | Free (open source)   | \$0.00           |
| **TOTAL PER SESSION**      |                                 |                      | ~\$0.165         |

## **16.2 Hackathon Demo Cost (Estimated)**

| **Activity**                         | **Estimated Cost**         |
| ------------------------------------ | -------------------------- |
| Persona generation (3-4 test users)  | ~\$0.05                    |
| Voice cloning (3-4 voices)           | Free on ElevenLabs starter |
| Demo sessions (15-20 sessions total) | ~\$2.50                    |
| Ingestion embeddings (test data)     | ~\$0.10                    |
| TOTAL HACKATHON SPEND                | Under \$3.00               |

## **16.3 Infrastructure Costs - Free Tiers**

| **Service**           | **Free Tier**                                               | **Paid Tier (if needed)** |
| --------------------- | ----------------------------------------------------------- | ------------------------- |
| **Supabase**          | 50,000 database rows, 1GB storage, 500MB bandwidth          | \$25/mo for Pro           |
| **Vercel (Frontend)** | Unlimited deployments, 100GB bandwidth                      | \$20/mo for Pro           |
| **Railway (Backend)** | \$5 credit/month (usually enough for demo)                  | \$5-20/mo                 |
| **ChromaDB**          | Free forever (open source, runs locally)                    | Chroma Cloud if needed    |
| **ElevenLabs**        | 10,000 chars/month free, voice cloning on Creator (\$22/mo) | \$22/mo Creator           |
| **OpenAI (Whisper)**  | \$5 free credit for new accounts                            | \$0.006/minute            |
| **Anthropic**         | \$5-20 free credit for new accounts                         | Pay per token             |

# **17\. Business Model & Revenue Strategy**

## **17.1 Pricing Tiers**

| **Tier** | **Price**  | **What's Included**                                                                                                              |
| -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FREE     | \$0        | 3 sessions per month, text only (no voice), 1 data source, basic mood tracking                                                   |
| PERSONAL | \$12/month | Unlimited sessions, full voice I/O, all 3 data sources, all modes, journal, insights dashboard                                   |
| PREMIUM  | \$25/month | Everything in Personal + priority response, multi-voice (e.g., clone a mentor's voice), export journal to PDF, advanced insights |

## **17.2 Unit Economics**

Cost per active user (assuming 15 sessions/month at \$0.165/session): \$2.48/month in AI API costs. At \$12/month, gross margin per paying user is approximately 79%. At scale with volume discounts on API pricing, this improves to ~85%.

## **17.3 Growth Strategy**

### **Phase 1 - Hackathon (Day 1-2)**

Build and demo the MVP. Win or place well. Use the win for PR. Post the demo on Twitter/X and LinkedIn. Submit to Product Hunt.

### **Phase 2 - Validation (Months 1-3)**

Launch free tier on Product Hunt and relevant subreddits (r/anxiety, r/mentalhealth, r/productivity). Target 500 free users. Run interviews with 20 of them. Identify the highest-engagement mode and use case. Iterate on the onboarding funnel.

### **Phase 3 - Monetization (Months 4-6)**

Gate voice features behind Personal plan. Target 5% free-to-paid conversion (industry average is 2-5%, Mirror's voice feature is a strong upgrade hook). At 500 free users and 5% conversion, 25 paying users = \$300 MRR. Reinvest in marketing.

### **Phase 4 - Scale (Month 6+)**

Partner with therapists and wellness coaches who recommend Mirror to clients as between-session support. Launch a Clinician Dashboard that lets therapists assign Mirror sessions and review mood data with client permission. This B2B2C model dramatically improves acquisition economics.

# **18\. 48-Hour Hackathon Build Plan**

| **Hours** | **Milestone**            | **Specific Tasks**                                                                                                                |
| --------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 0-2       | **Project scaffolding**  | Create repos, install dependencies, set up Supabase tables, configure .env files, test API keys, confirm CORS works end-to-end    |
| 2-6       | **Data ingestion**       | Build WhatsApp + ChatGPT + Claude parsers, chunker, ChromaDB insert, test with real data exports, verify vectors stored correctly |
| 6-10      | **Persona generation**   | Build persona_generator.py, test Claude call, store persona to Supabase, verify it sounds like the source person                  |
| 10-14     | **Voice pipeline**       | ElevenLabs voice clone endpoint, Whisper transcription, test full voice round-trip: speak → transcribe → synthesize → playback    |
| 14-20     | **Chat SSE endpoint**    | Build chat router, crisis detector, RAG retrieval, Claude streaming, sentence buffering, ElevenLabs sentence chunks, SSE events   |
| 20-26     | **Session.jsx frontend** | Build the core chat UI: mode selector, push-to-talk button, chat bubbles, SSE connection, audio playback queue, mood slider       |
| 26-30     | **Onboarding flow**      | Build 4-step onboarding: file upload → voice record → reflection questions → generating screen with progress polling              |
| 30-34     | **Journal + Insights**   | Session summary generation, journal list page, Recharts mood chart, usage stats                                                   |
| 34-38     | **UI polish**            | Tailwind styling pass, CrisisOverlay component, loading states, error handling, mobile layout check                               |
| 38-42     | **Integration testing**  | Full user journey from signup to completed session, fix any broken flows, test with 3 different data sets                         |
| 42-46     | **Deployment**           | Deploy backend to Railway, frontend to Vercel, set production env vars, verify demo works on deployed URLs                        |
| 46-48     | **Demo prep**            | Practice the demo script, prepare backup recordings, prepare slide deck, rehearse the pitch narrative                             |

## **18.1 Critical Path - What Cannot Slip**

If time runs short, the absolute minimum for a compelling demo is: working chat SSE endpoint + Session.jsx + persona generation. Everything else can be mocked or simplified. A demo where a judge types something vulnerable and hears the response in a cloned voice is worth more than a complete app that is not deployed.

## **18.2 What to Cut If Running Late**

- Insights dashboard → show static mockup data
- Journal feature → skip entirely
- Voice input (Whisper) → text only chat is fine
- Multi-source ingestion → WhatsApp only is sufficient
- Supabase auth → use hardcoded user ID for demo

# **19\. Demo Script & Pitch Guide**

## **19.1 The 90-Second Elevator Pitch**

| **OPENING** | 284 million people have anxiety. Therapy costs \$200 a session and has a 25-day waitlist. Existing apps are generic - they don't know you at all. |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |

| **THE INSIGHT** | Research from the University of Michigan shows that talking to yourself from a distance - like a separate version of you - dramatically reduces anxiety and boosts self-compassion. The problem is doing that in the moment is nearly impossible. |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| **THE SOLUTION** | Mirror builds an AI clone of you from your own WhatsApp messages, AI chat exports, and reflection answers. It responds in your voice. It knows your values. And it talks to you the way you would talk to your best friend. |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| **DEMO** | \[Hand device to judge\] Type something you're actually stressed about right now. \[Wait for response\] That's you. Talking to you. |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |

| **THE ASK** | We're at the MVP stage. The research is solid, the tech works, and we're looking for \[mentorship / early users / investment\]. |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |

## **19.2 The Live Demo Sequence**

- STEP 1 - SHOW ONBOARDING: Briefly show the file upload screen and explain what data Mirror uses. You do not need to run the full pipeline live - have a pre-built persona ready.
- STEP 2 - EXPLAIN THE PERSONA: Show the generated Personality Fingerprint (just the text). Read one sentence from it that sounds unmistakably like the person it was built from.
- STEP 3 - START A SESSION: Pick Vent mode. Ask a judge or teammate to type something real - a work stress, a social anxiety, anything genuine.
- STEP 4 - THE RESPONSE: Let Mirror respond. The response plays back in the user's cloned voice. The room goes quiet. This is your moment.
- STEP 5 - SHOW INSIGHTS: Briefly show the mood chart. "Over time, Mirror tracks whether users feel better after sessions - and which modes work best for them."

## **19.3 Anticipated Judge Questions & Answers**

| **Question**                                      | **Answer**                                                                                                                                                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Isn't this just ChatGPT?                          | ChatGPT doesn't know you. Mirror is built entirely from your personal data, responds in your voice, and uses psychological research on distanced self-talk as its core mechanic.               |
| Is this safe? What about mental health liability? | Mirror is clearly positioned as a self-care tool, not therapy. Crisis detection automatically surfaces 988 resources. We are not diagnosing or treating - we are providing a reflective space. |
| What if the data isn't authentic enough?          | The reflection questions are the safety net. Even if someone has minimal chat data, the 7 intentional answers about their values and coping style provide a strong enough foundation.          |
| How do you monetize?                              | Freemium model. Free tier is text-only, 3 sessions per month. \$12/month unlocks full voice, unlimited sessions, all data sources.                                                             |
| What's the moat?                                  | The data moat. Once a user's persona is built, their voice is cloned, and they've had 20 sessions - the switching cost is enormous. No competitor has their specific data.                     |

# **20\. Risk Analysis & Mitigations**

| **#** | **Risk**                                        | **Severity** | **Mitigation**                                                                                                             |
| ----- | ----------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1     | **ElevenLabs rate limit during demo**           | HIGH         | Pre-record demo audio for backup. Keep demo to 1-2 simultaneous users max.                                                 |
| 2     | **ChromaDB data loss on Railway restart**       | HIGH         | Mount a Railway volume at /app/chroma_data. Pre-generate persona before demo and cache to Supabase.                        |
| 3     | **Crisis detection false positive during demo** | MEDIUM       | Test crisis prompts thoroughly beforehand. Keep threshold at 0.7 confidence to reduce false positives.                     |
| 4     | **Whisper transcription too slow**              | MEDIUM       | Fall back to text input only. Demo still works - voice output is more impressive than voice input anyway.                  |
| 5     | **ElevenLabs voice clone sounds generic**       | MEDIUM       | Record in a quiet environment, speak naturally for full 60 seconds, use a passage with emotional range.                    |
| 6     | **CORS errors on production deploy**            | LOW          | Set FRONTEND_URL env var on Railway to Vercel URL. Test this at hour 42 during deployment step.                            |
| 7     | **Judge concerns about data privacy**           | LOW          | Use only your own data for the demo. Mention that in production, all data is user-owned and deletable.                     |
| 8     | **Claude API rate limits**                      | LOW          | Anthropic's default limits are high enough for hackathon scale. Haiku for crisis + Sonnet for chat keeps usage reasonable. |

## **20.1 Ethical Commitments**

- CRISIS SAFETY: Crisis detection is non-negotiable and must be in the MVP. No exceptions.
- CLEAR POSITIONING: Mirror is never described as therapy. Every onboarding screen states clearly it is a self-care tool.
- DATA OWNERSHIP: Users own their data. Export and delete options exist.
- NO DEPENDENCY DESIGN: Sessions end on a positive note. Mirror actively encourages real-world connection - it does not foster dependency.
- HONEST LIMITATIONS: If Mirror doesn't know something about the user, it says so in-character rather than making things up.

**MIRROR**

_The wisest version of you is already inside you._

_Mirror just helps you hear it._

_- End of Document -_
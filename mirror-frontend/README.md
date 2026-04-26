# Mirror — Frontend

AI mental wellness app. Talk to yourself. Heal yourself.

## Stack

| Layer        | Technology                               |
|--------------|------------------------------------------|
| Framework    | React 18 + Vite                          |
| Routing      | React Router v6                          |
| Auth + DB    | Supabase                                 |
| API client   | Axios (proxied to FastAPI backend)       |
| Charts       | Recharts                                 |
| Voice input  | MediaRecorder API (built-in browser)     |
| Voice output | Web Audio API queue (built-in browser)   |
| Styling      | Pure CSS variables — no Tailwind needed  |

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Start dev server (FastAPI backend must be on port 8000)
npm run dev
# → http://localhost:5173
```

## File structure

```
src/
├── lib/
│   └── supabase.js              Supabase client
├── api/
│   └── client.js                All API calls to FastAPI
├── context/
│   ├── AuthContext.jsx          User auth state
│   └── CloneContext.jsx         Persona + voice clone state
├── hooks/
│   ├── useVoiceInput.js         MediaRecorder → Whisper transcription
│   ├── useAudioPlayer.js        Web Audio API chunk queue
│   └── useSSE.js                EventSource manager for streaming
├── components/
│   ├── Sidebar.jsx              Main navigation sidebar
│   ├── VoiceButton.jsx          Push-to-talk with waveform
│   ├── ChatBubble.jsx           Message bubbles
│   ├── ModeSelector.jsx         Vent / Reframe / Boost picker
│   ├── MoodSlider.jsx           1–5 mood rating buttons
│   ├── IntentionInput.jsx       Pre-session intention field
│   ├── CrisisOverlay.jsx        Crisis detection modal
│   ├── MoodChart.jsx            Recharts mood trend chart
│   └── SessionCard.jsx          Session summary card
└── pages/
    ├── Landing.jsx              Marketing homepage
    ├── Auth.jsx                 Login / Sign up
    ├── Home.jsx                 Dashboard
    ├── Session.jsx              Live voice/text chat
    ├── Journal.jsx              Session history + detail view
    ├── Insights.jsx             Mood charts + usage stats
    ├── Settings.jsx             Profile, voice, preferences
    └── onboarding/
        ├── OnboardLayout.jsx    Progress bar wrapper
        ├── Step1Import.jsx      Upload WhatsApp/ChatGPT/Claude
        ├── Step2Voice.jsx       Record 60s voice sample
        ├── Step3Reflect.jsx     7 reflection questions
        └── Step4Generating.jsx  AI persona generation
```

## Routes

| Route              | Page                          |
|--------------------|-------------------------------|
| `/`                | Landing page                  |
| `/auth`            | Login / Sign up               |
| `/onboard/import`  | Step 1 — Upload data sources  |
| `/onboard/voice`   | Step 2 — Record voice sample  |
| `/onboard/reflect` | Step 3 — Reflection questions |
| `/onboard/generating` | Step 4 — Persona generation |
| `/home`            | Dashboard                     |
| `/session`         | Live session                  |
| `/journal`         | Session history               |
| `/journal/:id`     | Session detail                |
| `/insights`        | Mood trends                   |
| `/settings`        | Profile & preferences         |

## Environment variables

| Variable              | Description                            |
|-----------------------|----------------------------------------|
| `VITE_SUPABASE_URL`   | Your Supabase project URL              |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key       |
| `VITE_API_URL`        | Backend URL (blank = Vite proxy)       |

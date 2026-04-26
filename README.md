MIRROR — Talk to Yourself. Heal Yourself

Mirror is an AI-powered mental wellness application that creates a personalized AI clone of the user using their own words, voice, and thinking patterns. It allows users to talk through stress, decisions, and emotions with a version of themselves that reflects their own reasoning and values.

Overview

Many people experience stress and anxiety but lack access to immediate, affordable, and personalized support. Existing solutions are often expensive, generic, or unavailable when needed.

Mirror addresses this by enabling users to interact with an AI system built entirely from their own data, providing responses that feel familiar, personal, and relevant.

Key Features
AI Persona Generation
Builds a personalized AI model from user data and reflection inputs
Voice Cloning
Generates responses in the user’s own voice
Retrieval-Augmented Memory
Uses past messages to provide context-aware responses
Conversation Modes
Vent: listens and reflects without giving advice
Reframe: helps challenge negative thinking
Boost: provides motivation and confidence
Session Summaries
Generates short reflections after each conversation
Mood Tracking
Tracks emotional changes before and after sessions
Crisis Detection
Detects high-risk inputs and surfaces support resources
Technology Stack

Frontend

React (Vite)
Tailwind CSS
Web Audio API

Backend

FastAPI (Python)
Supabase (database and authentication)

AI Services

Claude API (persona generation and chat)
OpenAI Whisper (speech-to-text)
ElevenLabs (voice synthesis and cloning)

Data Layer

ChromaDB (vector database for memory retrieval)
How It Works
The user uploads personal data such as chat exports
The user answers reflection questions
The user records a short voice sample
The system generates a personalized AI persona
The user begins interacting with the system through voice or text
Getting Started
Clone the Repository
git clone https://github.com/your-username/mirror.git
cd mirror
Frontend Setup
cd frontend
npm install
npm run dev
Backend Setup
cd backend
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload
Environment Variables

Create a .env file in the backend directory:

SUPABASE_URL=your_url
SUPABASE_KEY=your_key
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
Project Structure
mirror/
├── frontend/    # React application
├── backend/     # FastAPI server
├── chroma_data/ # Vector database storage
Hackathon Scope

Minimum viable demo should include:

Chat system with AI responses
Basic persona generation
Voice output

Optional features:

Insights dashboard
Journal system
Full authentication flow
Disclaimer

Mirror is intended as a self-care tool and does not replace professional mental health services. Users in crisis should seek immediate help from qualified professionals.

Future Improvements
Mobile application support
Advanced analytics and insights
Multi-persona support (mentor, coach, etc.)
Improved personalization models

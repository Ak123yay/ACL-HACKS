import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useClone } from '../context/CloneContext'
import { createChatStream, endSession, startSession } from '../api/client'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import ChatBubble from '../components/ChatBubble'
import VoiceButton from '../components/VoiceButton'
import ModeSelector from '../components/ModeSelector'
import MoodSlider from '../components/MoodSlider'
import IntentionInput from '../components/IntentionInput'
import CrisisOverlay from '../components/CrisisOverlay'

const PHASE = { PRE: 'pre', CHAT: 'chat', POST: 'post' }

export default function Session() {
  const [searchParams]  = useSearchParams()
  const nav             = useNavigate()
  const { user }        = useAuth()
  const { voiceId }     = useClone()

  const [phase,       setPhase]       = useState(PHASE.PRE)
  const [mode,        setMode]        = useState(searchParams.get('mode') || 'vent')
  const [intention,   setIntention]   = useState('')
  const [moodBefore,  setMoodBefore]  = useState(null)
  const [moodAfter,   setMoodAfter]   = useState(null)
  const [sessionId,   setSessionId]   = useState(null)
  const [messages,    setMessages]    = useState([])
  const [inputText,   setInputText]   = useState('')
  const [streaming,   setStreaming]   = useState(false)
  const [streamingId, setStreamingId] = useState(null)
  const [crisis,      setCrisis]      = useState(false)
  const [ending,      setEnding]      = useState(false)
  const [startErr,    setStartErr]    = useState('')

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  const { enqueueChunk, clearQueue } = useAudioPlayer()
  const { isRecording, toggle: toggleMic, error: micError } = useVoiceInput(
    useCallback((transcript) => {
      if (transcript) setInputText(transcript)
    }, [])
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (phase === PHASE.CHAT) inputRef.current?.focus()
  }, [phase])

  const handleStartSession = async () => {
    if (!moodBefore) return
    setStartErr('')
    try {
      const { data } = await startSession({
        user_id: user.id, mode, intention, mood_before: moodBefore,
      })
      setSessionId(data.session_id)
      const welcomeLines = {
        vent:    "I'm here. No advice — just presence. What's on your mind?",
        reframe: "Ready to look at things together. What's been weighing on you?",
        boost:   "Let's go. What are we preparing for?",
      }
      setMessages([{
        id: 'welcome', role: 'assistant',
        content: `${intention ? `You wanted to: "${intention}". ` : ''}${welcomeLines[mode]}`,
      }])
      setPhase(PHASE.CHAT)
    } catch {
      setStartErr('Could not start session. Make sure the backend is running.')
    }
  }

  const sendMessage = useCallback(async () => {
    const text = inputText.trim()
    if (!text || streaming) return

    setInputText('')
    const userMsg   = { id: Date.now(), role: 'user', content: text }
    const assistantId = Date.now() + 1

    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setStreaming(true)
    setStreamingId(assistantId)

    try {
      const es = await createChatStream({
        userId: user.id, sessionId, message: text, mode, intention, voiceId,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      })

      es.addEventListener('text', (e) => {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + e.data } : m)
        )
      })
      es.addEventListener('audio', (e) => enqueueChunk(e.data))
      es.addEventListener('crisis', () => {
        setCrisis(true)
        es.close()
        setStreaming(false)
        setStreamingId(null)
      })
      es.addEventListener('done', () => {
        setStreaming(false)
        setStreamingId(null)
        es.close()
      })
      es.onerror = () => {
        setStreaming(false)
        setStreamingId(null)
        es.close()
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      setStreaming(false)
      setStreamingId(null)
    }
  }, [inputText, streaming, user, sessionId, mode, intention, voiceId, messages, enqueueChunk])

  const handleEndSession = async () => {
    if (!moodAfter) return
    setEnding(true)
    clearQueue()
    try {
      await endSession({ session_id: sessionId, user_id: user.id, messages, mood_after: moodAfter })
      nav('/home')
    } catch { setEnding(false) }
  }

  // ── PRE phase ──────────────────────────────────────────────────────────────
  if (phase === PHASE.PRE) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 500 }} className="fade-in">
        <button
          onClick={() => nav('/home')}
          style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          ← Back to home
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 300, marginBottom: 6 }}>
          Set your intention
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 32 }}>
          Take a breath. What's brought you here today?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Session mode
            </p>
            <ModeSelector value={mode} onChange={setMode} />
          </div>

          <IntentionInput value={intention} onChange={setIntention} />

          <MoodSlider
            value={moodBefore}
            onChange={setMoodBefore}
            label="How are you feeling right now? (1 = low, 5 = great)"
          />

          {startErr && (
            <p style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>{startErr}</p>
          )}

          <button
            className="btn-primary"
            onClick={handleStartSession}
            disabled={!moodBefore}
            style={{ padding: '14px', fontSize: '0.95rem' }}
          >
            Begin session
          </button>
        </div>
      </div>
    </div>
  )

  // ── POST phase ─────────────────────────────────────────────────────────────
  if (phase === PHASE.POST) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }} className="fade-in">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>
          Session complete
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 36 }}>
          You showed up for yourself. How are you feeling now?
        </p>
        <MoodSlider value={moodAfter} onChange={setMoodAfter} label="After this session (1–5)" />
        <button
          className="btn-primary"
          onClick={handleEndSession}
          disabled={!moodAfter || ending}
          style={{ width: '100%', marginTop: 32, padding: '14px' }}
        >
          {ending
            ? <span className="loading-spinner" style={{ width: 17, height: 17 }} />
            : 'Save & finish'}
        </button>
      </div>
    </div>
  )

  // ── CHAT phase ─────────────────────────────────────────────────────────────
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      maxWidth: 740, margin: '0 auto', padding: '0 16px',
    }}>
      {crisis && <CrisisOverlay onDismiss={() => setCrisis(false)} />}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--border-soft)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
          <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
            Mirror · {mode}
          </span>
          {intention && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              · "{intention}"
            </span>
          )}
        </div>
        <button
          className="btn-ghost"
          onClick={() => setPhase(PHASE.POST)}
          style={{ padding: '7px 14px', fontSize: '0.78rem' }}
        >
          End session
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isUser={msg.role === 'user'}
            isStreaming={streaming && msg.id === streamingId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '14px 0 20px', borderTop: '1px solid var(--border-soft)', flexShrink: 0 }}>
        {micError && (
          <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: 8 }}>{micError}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <VoiceButton isRecording={isRecording} onToggle={toggleMic} disabled={streaming} />
          <textarea
            ref={inputRef}
            className="input-field"
            placeholder={isRecording ? 'Listening…' : 'Speak or type…'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={2}
            style={{ resize: 'none', flex: 1, lineHeight: 1.6 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
            }}
          />
          <button
            className="btn-primary"
            onClick={sendMessage}
            disabled={!inputText.trim() || streaming}
            style={{ padding: '14px 18px', flexShrink: 0 }}
          >
            {streaming
              ? <span className="loading-spinner" style={{ width: 16, height: 16 }} />
              : '→'}
          </button>
        </div>
      </div>
    </div>
  )
}

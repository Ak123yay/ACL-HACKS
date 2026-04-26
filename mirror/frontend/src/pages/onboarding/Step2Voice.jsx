import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cloneVoice } from '../../api/client'
import { supabase } from '../../lib/supabase'

const SAMPLE_SCRIPT =
  'The most important conversations I will ever have are with myself — not the anxious inner critic, ' +
  'but the wise, grounded voice that already knows what I need to hear. That voice is kind, clear, ' +
  'and always available, if I know how to listen. Today I am choosing to listen. ' +
  'I trust that I have the answers I need. I am allowed to take up space, to feel what I feel, ' +
  'and to speak honestly about it. The version of me that handles things well is not far away. ' +
  'It is right here, right now, in this breath.'

const getCloneErrorMessage = (err) => {
  const status = err?.response?.status
  const detail = err?.response?.data?.detail

  if (status === 504 || /timed\s*out|timeout/i.test(String(detail || ''))) {
    return 'Voice cloning timed out on the server. Please try again; this step can take up to a few minutes.'
  }

  if (status === 503) {
    return 'Voice service is temporarily unavailable. Please try again in a minute.'
  }

  if (typeof detail === 'string' && detail.trim()) {
    return detail
  }

  return 'Voice cloning failed after recording. Please try again.'
}

const getRecordingErrorMessage = (err) => {
  const name = err?.name

  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Microphone access is blocked. Enable microphone permission for this site, then try again.'
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'No microphone was found. Connect a microphone and try again.'
  }

  return 'Could not start recording. Check your microphone and browser permissions, then try again.'
}

export default function Step2Voice() {
  const { user } = useAuth()
  const nav      = useNavigate()

  const [state,   setState]   = useState('idle')  // idle|recording|processing|done|error
  const [elapsed, setElapsed] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const mrRef     = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr     = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        clearInterval(timerRef.current)
        setState('processing')
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        try {
          await cloneVoice(blob, user.id)
          await supabase.from('profiles').update({ onboarding_step: 2 }).eq('id', user.id)
          setState('done')
        } catch (err) {
          setErrorMessage(getCloneErrorMessage(err))
          setState('error')
        }
      }

      mr.start()
      mrRef.current = mr
      setState('recording')
      setErrorMessage('')
      setElapsed(0)

      timerRef.current = setInterval(() => {
        setElapsed((s) => {
          if (s >= 59) {
            mrRef.current?.stop()
            clearInterval(timerRef.current)
            return 60
          }
          return s + 1
        })
      }, 1000)
    } catch (err) {
      setErrorMessage(getRecordingErrorMessage(err))
      setState('error')
    }
  }, [user])

  const stopEarly = () => {
    clearInterval(timerRef.current)
    mrRef.current?.stop()
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const pct          = Math.min((elapsed / 60) * 100, 100)
  const circumference = 2 * Math.PI * 50

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>
        Clone your voice
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: 24 }}>
        Record 60 seconds of natural speech. Read the passage below aloud, in your normal speaking voice.
        This recording will be used to synthesize all of Mirror's audio responses.
      </p>

      {/* Sample script */}
      <div className="card" style={{ marginBottom: 28, borderLeft: '2px solid var(--rose-dim)' }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          fontStyle: 'italic', lineHeight: 1.85,
          color: 'var(--text-secondary)', fontWeight: 300,
        }}>
          "{SAMPLE_SCRIPT}"
        </p>
      </div>

      {/* Circular timer */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', width: 128, height: 128, margin: '0 auto 20px' }}>
          <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-soft)" strokeWidth="4" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={state === 'done' ? 'var(--success)' : 'var(--rose)'}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            {state === 'done' ? (
              <span style={{ fontSize: 28 }}>✓</span>
            ) : (
              <>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 300 }}>
                  {elapsed}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>/ 60s</span>
              </>
            )}
          </div>
        </div>

        {state === 'idle' && (
          <button className="btn-primary" onClick={startRecording} style={{ padding: '12px 36px' }}>
            ● Start recording
          </button>
        )}
        {state === 'recording' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--rose)', animation: 'breathe 1.5s ease-in-out infinite' }}>
              Recording — speak naturally
            </p>
            <button
              className="btn-ghost"
              onClick={stopEarly}
              style={{ padding: '8px 20px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
            >
              ⏹ Stop recording
            </button>
          </div>
        )}
        {state === 'processing' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div className="loading-spinner" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>Cloning your voice…</span>
          </div>
        )}
        {state === 'done' && (
          <p style={{ color: 'var(--success)', fontSize: '0.88rem' }}>
            Voice cloned successfully
          </p>
        )}
        {state === 'error' && (
          <div>
            <p style={{ color: 'var(--danger)', fontSize: '0.83rem', marginBottom: 12 }}>
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
            <button
              className="btn-ghost"
              onClick={() => {
                setErrorMessage('')
                setState('idle')
              }}
              style={{ fontSize: '0.83rem' }}
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn-ghost" onClick={() => nav('/onboard/import')} style={{ flex: 1, padding: '13px' }}>
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={() => nav('/onboard/reflect')}
          disabled={state !== 'done'}
          style={{ flex: 2, padding: '13px' }}
        >
          Continue →
        </button>
      </div>
      <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.73rem', color: 'var(--text-muted)' }}>
        You can re-record your voice at any time in Settings.
      </p>
    </div>
  )
}

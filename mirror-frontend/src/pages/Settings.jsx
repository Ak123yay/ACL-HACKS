import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useClone } from '../context/CloneContext'
import { cloneVoice, updateProfile } from '../api/client'
import Sidebar from '../components/Sidebar'

export default function Settings() {
  const { user, profile, refreshProfile } = useAuth()
  const { modePreference, setModePreference, voiceId } = useClone()

  const [displayName,  setDisplayName]  = useState(profile?.display_name || '')
  const [saving,       setSaving]       = useState(false)
  const [savedMsg,     setSavedMsg]     = useState('')
  const [showReRecord, setShowReRecord] = useState(false)
  const [recState,     setRecState]     = useState('idle') // idle|recording|processing|done|error

  const mrRef     = useRef(null)
  const chunksRef = useRef([])
  const timerRef  = useRef(null)

  const saveProfile = async () => {
    setSaving(true)
    setSavedMsg('')
    try {
      await updateProfile(user.id, {
        display_name:    displayName,
        mode_preference: modePreference,
      })
      await refreshProfile()
      setSavedMsg('Changes saved.')
      setTimeout(() => setSavedMsg(''), 3000)
    } catch {
      setSavedMsg('Error saving. Please try again.')
    }
    setSaving(false)
  }

  const startReRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr     = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        clearInterval(timerRef.current)
        setRecState('processing')
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        try {
          await cloneVoice(blob, user.id)
          await refreshProfile()
          setRecState('done')
        } catch { setRecState('error') }
      }

      mr.start()
      mrRef.current  = mr
      setRecState('recording')

      // Auto-stop at 60s
      timerRef.current = setTimeout(() => mrRef.current?.stop(), 60000)
    } catch { setRecState('error') }
  }

  const stopReRecord = () => {
    clearTimeout(timerRef.current)
    mrRef.current?.stop()
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-with-sidebar fade-in" style={{ maxWidth: 640 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Manage your profile and preferences</p>

        {/* Profile card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: 20 }}>
            Profile
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Display name
              </label>
              <input
                className="input-field"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Email
              </label>
              <input
                className="input-field"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.5, cursor: 'default' }}
              />
            </div>
          </div>
        </div>

        {/* Default mode card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: 6 }}>
            Default session mode
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            This mode is pre-selected when you start a new session.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['vent', 'reframe', 'boost'].map((m) => {
              const active = modePreference === m
              return (
                <button
                  key={m}
                  onClick={() => setModePreference(m)}
                  style={{
                    flex: 1, padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '1px solid rgba(196,160,160,.3)' : '1px solid var(--border-soft)',
                    background: active ? 'rgba(196,160,160,0.1)' : 'transparent',
                    color: active ? 'var(--rose-bright)' : 'var(--text-secondary)',
                    fontSize: '0.84rem', fontWeight: active ? 500 : 400,
                    textTransform: 'capitalize', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {m}
                </button>
              )
            })}
          </div>
        </div>

        {/* Voice card */}
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: 8 }}>
            Voice clone
          </h3>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 18 }}>
            {voiceId
              ? '✓ Your voice is cloned and active. Mirror will speak in your voice during sessions.'
              : 'No voice clone found. Re-record to enable voice responses.'}
          </p>

          {!showReRecord ? (
            <button className="btn-ghost" onClick={() => setShowReRecord(true)}>
              Re-record voice sample
            </button>
          ) : (
            <div>
              {recState === 'idle' && (
                <div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
                    Speak naturally for 60 seconds — read aloud, narrate your day, anything in your real voice.
                  </p>
                  <button className="btn-primary" onClick={startReRecord}>
                    ● Start recording
                  </button>
                </div>
              )}
              {recState === 'recording' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--danger)', animation: 'breathe 1s ease-in-out infinite' }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>Recording…</span>
                  <button
                    className="btn-ghost"
                    onClick={stopReRecord}
                    style={{ marginLeft: 'auto', borderColor: 'var(--danger)', color: 'var(--danger)', padding: '7px 16px', fontSize: '0.8rem' }}
                  >
                    Stop
                  </button>
                </div>
              )}
              {recState === 'processing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="loading-spinner" />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>Cloning your voice…</span>
                </div>
              )}
              {recState === 'done' && (
                <p style={{ color: 'var(--success)', fontSize: '0.84rem' }}>✓ Voice clone updated successfully.</p>
              )}
              {recState === 'error' && (
                <p style={{ color: 'var(--danger)', fontSize: '0.83rem' }}>
                  Something went wrong. Check your microphone and try again.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Save */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            className="btn-primary"
            onClick={saveProfile}
            disabled={saving}
            style={{ padding: '12px 28px' }}
          >
            {saving ? <span className="loading-spinner" style={{ width: 16, height: 16 }} /> : 'Save changes'}
          </button>
          {savedMsg && (
            <p style={{
              fontSize: '0.83rem',
              color: savedMsg.includes('Error') ? 'var(--danger)' : 'var(--success)',
            }}>
              {savedMsg}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

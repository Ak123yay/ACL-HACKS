import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { uploadFile, getIngestStatus } from '../../api/client'
import { supabase } from '../../lib/supabase'

const SOURCES = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    ext: '.txt',
    hint: 'Open a chat → ⋮ → More → Export Chat → Without Media',
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    ext: '.json',
    hint: 'Settings → Data Controls → Export → conversations.json',
  },
  {
    id: 'claude',
    label: 'Claude.ai',
    ext: '.json',
    hint: 'Settings → Privacy → Export data → conversations.json',
  },
]

export default function Step1Import() {
  const { user } = useAuth()
  const nav      = useNavigate()

  const [uploaded, setUploaded] = useState({})   // { sourceId: { chunks, name } }
  const [progress, setProgress] = useState({})   // { sourceId: 0-100 }
  const [polling,  setPolling]  = useState({})   // { sourceId: bool }
  const [error,    setError]    = useState('')
  const inputRefs = useRef({})

  const handleFile = async (sourceId, file) => {
    setError('')
    const fd = new FormData()
    fd.append('file',    file)
    fd.append('source',  sourceId)
    fd.append('user_id', user.id)

    try {
      setProgress((p) => ({ ...p, [sourceId]: 5 }))
      const { data } = await uploadFile(fd, (pct) =>
        setProgress((p) => ({ ...p, [sourceId]: Math.max(pct, 5) }))
      )
      const jobId = data.job_id

      setPolling((p) => ({ ...p, [sourceId]: true }))
      const poll = setInterval(async () => {
        try {
          const { data: status } = await getIngestStatus(jobId)
          if (status.status === 'complete') {
            clearInterval(poll)
            setPolling((p) => ({ ...p, [sourceId]: false }))
            setProgress((p) => ({ ...p, [sourceId]: 100 }))
            setUploaded((u) => ({ ...u, [sourceId]: { chunks: status.chunks_added, name: file.name } }))
          } else if (status.status === 'error') {
            clearInterval(poll)
            setPolling((p) => ({ ...p, [sourceId]: false }))
            setError(`Failed to process ${file.name}: ${status.error || 'Unknown error'}`)
            setProgress((p) => ({ ...p, [sourceId]: 0 }))
          }
        } catch { clearInterval(poll); setPolling((p) => ({ ...p, [sourceId]: false })) }
      }, 2000)
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed. Check your backend connection.')
      setProgress((p) => ({ ...p, [sourceId]: 0 }))
    }
  }

  const handleContinue = async () => {
    if (Object.keys(uploaded).length === 0) {
      setError('Upload at least one source to continue.')
      return
    }
    await supabase.from('profiles').update({ onboarding_step: 1 }).eq('id', user.id)
    nav('/onboard/voice')
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>
        Import your data
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: 28 }}>
        Mirror reads your past conversations to understand how you think and communicate.
        Upload at least one source — you can add more later in Settings.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {SOURCES.map((source) => {
          const done  = !!uploaded[source.id]
          const pct   = progress[source.id] || 0
          const busy  = polling[source.id]
          const uploading = pct > 0 && pct < 100

          return (
            <div
              key={source.id}
              className="card"
              style={{
                borderColor: done ? 'rgba(122,173,154,0.3)' : 'var(--border-soft)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Progress bar */}
              {uploading && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  height: 2, width: `${pct}%`,
                  background: 'var(--rose)',
                  transition: 'width 0.3s',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{source.label}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 99,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      fontSize: '0.68rem', color: 'var(--text-muted)',
                    }}>
                      {source.ext}
                    </span>
                    {done && (
                      <span className="tag tag-green">
                        ✓ {uploaded[source.id].chunks} chunks indexed
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {source.hint}
                  </p>
                  {done && (
                    <p style={{ fontSize: '0.73rem', color: 'var(--success)', marginTop: 6 }}>
                      {uploaded[source.id].name}
                    </p>
                  )}
                </div>

                <div style={{ flexShrink: 0 }}>
                  {busy ? (
                    <div className="loading-spinner" />
                  ) : (
                    <button
                      className={done ? 'btn-ghost' : 'btn-primary'}
                      onClick={() => inputRefs.current[source.id]?.click()}
                      style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                    >
                      {done ? 'Replace' : 'Upload'}
                    </button>
                  )}
                  <input
                    ref={(el) => { inputRefs.current[source.id] = el }}
                    type="file"
                    accept={source.ext}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFile(source.id, e.target.files[0])
                      e.target.value = ''
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.82rem', marginBottom: 16 }}>{error}</p>
      )}

      <button
        className="btn-primary"
        onClick={handleContinue}
        disabled={Object.keys(uploaded).length === 0}
        style={{ width: '100%', padding: '14px' }}
      >
        Continue →
      </button>
      <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Your data is processed and stored securely. It never leaves your account.
      </p>
    </div>
  )
}

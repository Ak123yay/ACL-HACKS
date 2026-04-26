import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSessions, getSession } from '../api/client'
import Sidebar from '../components/Sidebar'
import SessionCard from '../components/SessionCard'

// Detail view for a single journal entry
function JournalDetail({ sessionId, onBack }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession(sessionId)
      .then((r) => setSession(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [sessionId])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div className="loading-spinner" style={{ width: 24, height: 24 }} />
    </div>
  )

  if (!session) return (
    <div>
      <button onClick={onBack} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', marginBottom: 24 }}>
        ← Back
      </button>
      <p style={{ color: 'var(--text-muted)' }}>Session not found.</p>
    </div>
  )

  const date = new Date(session.started_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const moodDelta = session.mood_after != null && session.mood_before != null
    ? session.mood_after - session.mood_before
    : null

  return (
    <div className="fade-in">
      <button
        onClick={onBack}
        style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', marginBottom: 28, fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← All sessions
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, marginBottom: 4 }}>
            {date}
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag tag-rose" style={{ textTransform: 'capitalize' }}>{session.mode}</span>
            {session.intention && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{session.intention}"
              </span>
            )}
          </div>
        </div>
        {moodDelta !== null && (
          <div style={{
            textAlign: 'center', padding: '12px 20px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-soft)',
            borderRadius: 'var(--radius-md)',
          }}>
            <p style={{
              fontSize: '1.4rem', fontWeight: 500,
              color: moodDelta > 0 ? 'var(--success)' : moodDelta < 0 ? 'var(--danger)' : 'var(--text-muted)',
            }}>
              {moodDelta > 0 ? '+' : ''}{moodDelta}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {session.mood_before} → {session.mood_after}
            </p>
          </div>
        )}
      </div>

      {session.summary && (
        <div className="card" style={{ marginBottom: 28, borderLeft: '2px solid var(--rose-dim)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
            Session summary
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            {session.summary}
          </p>
        </div>
      )}

      {/* Transcript */}
      {session.messages?.length > 0 && (
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 16 }}>
            Transcript
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {session.messages.map((msg, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: msg.role === 'user' ? 'transparent' : 'var(--bg-elevated)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-soft)',
                borderLeft: msg.role === 'user' ? '2px solid var(--rose-dim)' : 'none',
                marginLeft: msg.role === 'user' ? 16 : 0,
              }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {msg.role === 'user' ? 'You' : 'Mirror'}
                </p>
                <p style={{ fontSize: '0.87rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Main journal list
export default function Journal() {
  const { id: sessionId } = useParams()
  const nav               = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getSessions()
      .then((r) => setSessions(r.data.sessions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-with-sidebar fade-in">
        {sessionId ? (
          <JournalDetail sessionId={sessionId} onBack={() => nav('/journal')} />
        ) : (
          <>
            <h1 className="page-title">Journal</h1>
            <p className="page-sub">Your session history and reflections</p>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
                <div className="loading-spinner" style={{ width: 26, height: 26 }} />
              </div>
            ) : sessions.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, marginBottom: 10 }}>
                  No sessions yet
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: 24 }}>
                  Your sessions will appear here after you complete them.
                </p>
                <button className="btn-primary" onClick={() => nav('/session')}>
                  Start your first session
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

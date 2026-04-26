import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useClone } from '../context/CloneContext'
import { getSessions } from '../api/client'
import Sidebar from '../components/Sidebar'
import SessionCard from '../components/SessionCard'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const QUICK_MODES = [
  { id: 'vent',    label: 'Vent',    icon: '◎', desc: 'Be heard' },
  { id: 'reframe', label: 'Reframe', icon: '◈', desc: 'Gain clarity' },
  { id: 'boost',   label: 'Boost',   icon: '◆', desc: 'Build energy' },
]

export default function Home() {
  const nav = useNavigate()
  const { profile }             = useAuth()
  const { isOnboardingComplete } = useClone()
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!isOnboardingComplete) { nav('/onboard/import'); return }
    getSessions()
      .then((r) => setSessions((r.data.sessions || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isOnboardingComplete])

  const firstName = profile?.display_name?.split(' ')[0] || null

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main className="main-with-sidebar fade-in">

        {/* Greeting */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="page-title">
          {getGreeting()}{firstName ? `, ${firstName}` : ''}.
        </h1>
        <p className="page-sub">What do you need today?</p>

        {/* Start session hero card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(196,160,160,0.1), rgba(196,165,90,0.05))',
          border: '1px solid rgba(196,160,160,0.14)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          marginBottom: 36,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 260, height: 260,
            background: 'radial-gradient(ellipse, rgba(196,160,160,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 300, marginBottom: 8 }}>
            Start a session
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24, maxWidth: 400 }}>
            Choose your mode and speak or type. Your Mirror is ready.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            {QUICK_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => nav(`/session?mode=${mode.id}`)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-soft)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(196,160,160,0.12)'
                  e.currentTarget.style.borderColor = 'rgba(196,160,160,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'var(--border-soft)'
                }}
              >
                <span style={{ fontSize: 16 }}>{mode.icon}</span>
                <span>{mode.label}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{mode.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <div className="loading-spinner" style={{ width: 24, height: 24 }} />
          </div>
        ) : sessions.length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400 }}>
                Recent sessions
              </h3>
              <button
                onClick={() => nav('/journal')}
                style={{ fontSize: '0.8rem', color: 'var(--rose)', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                View all →
              </button>
            </div>
            <div className="grid-3">
              {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
            </div>
          </>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '52px 24px' }}>
            <p style={{ fontSize: '2rem', marginBottom: 14 }}>✦</p>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: '1.3rem',
              fontWeight: 300, marginBottom: 10,
            }}>
              Your first session awaits
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Start above to begin talking with your Mirror.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

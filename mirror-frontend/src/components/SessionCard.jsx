import { useNavigate } from 'react-router-dom'

const MODE_ACCENT = {
  vent:    'var(--rose)',
  reframe: 'var(--gold)',
  boost:   'var(--success)',
}

export default function SessionCard({ session }) {
  const nav = useNavigate()
  const date = new Date(session.started_at)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const moodDelta =
    session.mood_after != null && session.mood_before != null
      ? session.mood_after - session.mood_before
      : null
  const accent = MODE_ACCENT[session.mode] || 'var(--text-muted)'

  return (
    <div
      className="card"
      onClick={() => nav(`/journal/${session.id}`)}
      style={{ cursor: 'pointer' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--border)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-soft)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <span style={{
            display: 'inline-block', marginBottom: 6,
            padding: '3px 10px', borderRadius: 99,
            fontSize: '0.7rem', fontWeight: 500,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            background: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}28`,
          }}>
            {session.mode}
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {dateStr} · {timeStr}
          </p>
        </div>
        {moodDelta !== null && (
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '1.05rem', fontWeight: 500,
              color: moodDelta > 0 ? 'var(--success)' : moodDelta < 0 ? 'var(--danger)' : 'var(--text-muted)',
            }}>
              {moodDelta > 0 ? '+' : ''}{moodDelta}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>mood shift</p>
          </div>
        )}
      </div>

      {session.intention && (
        <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 8 }}>
          "{session.intention}"
        </p>
      )}

      {session.summary && (
        <p style={{
          fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {session.summary}
        </p>
      )}
    </div>
  )
}

export default function CrisisOverlay({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(8,9,16,0.93)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        maxWidth: 460, width: '100%',
        background: 'var(--bg-elevated)',
        border: '1px solid rgba(196,112,110,0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 36px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 18 }}>💙</div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.9rem', fontWeight: 300,
          marginBottom: 14,
        }}>
          You're not alone
        </h2>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.88rem',
          lineHeight: 1.75, marginBottom: 28,
        }}>
          It sounds like you might be going through something really hard right now.
          Mirror cares about you. The most important thing is that you get real support.
        </p>

        <div style={{
          background: 'rgba(196,160,160,0.07)',
          border: '1px solid rgba(196,160,160,0.14)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: 24,
          textAlign: 'left',
        }}>
          <p style={{
            fontSize: '0.72rem', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 12,
          }}>
            Crisis resources
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>
            <strong>988 Suicide &amp; Crisis Lifeline</strong><br />
            Call or text <strong style={{ color: 'var(--rose-bright)' }}>988</strong> — available 24/7
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>
            <strong>Crisis Text Line</strong><br />
            Text <strong style={{ color: 'var(--rose-bright)' }}>HOME</strong> to <strong style={{ color: 'var(--rose-bright)' }}>741741</strong>
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>International resources</strong><br />
            <a
              href="https://www.iasp.info/resources/Crisis_Centres/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--rose)', fontSize: '0.82rem' }}
            >
              Find your local crisis centre →
            </a>
          </p>
        </div>

        <button
          className="btn-ghost"
          onClick={onDismiss}
          style={{ width: '100%', padding: '13px' }}
        >
          I'm okay — return to Mirror
        </button>
      </div>
    </div>
  )
}

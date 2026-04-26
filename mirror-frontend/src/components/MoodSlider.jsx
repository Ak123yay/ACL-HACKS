const LABELS = ['', 'Low',  'Okay',    'Neutral', 'Good',    'Great']
const COLORS = ['', '#c4706e', '#c4a55a', '#a09ba8', '#7aad9a', '#7aad9a']

export default function MoodSlider({ value, onChange, label }) {
  return (
    <div>
      {label && (
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
          {label}
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 48, height: 48,
              borderRadius: '50%',
              border: value === n
                ? `2px solid ${COLORS[n]}`
                : '1px solid var(--border-soft)',
              background: value === n ? `${COLORS[n]}22` : 'var(--bg-elevated)',
              color: value === n ? COLORS[n] : 'var(--text-muted)',
              font: '500 1rem var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {value != null && (
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8rem', color: COLORS[value] }}>
          {LABELS[value]}
        </p>
      )}
    </div>
  )
}

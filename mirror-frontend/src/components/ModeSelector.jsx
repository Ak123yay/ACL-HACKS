const MODES = [
  { id: 'vent',    label: 'Vent',    desc: 'Just be heard',      icon: '◎' },
  { id: 'reframe', label: 'Reframe', desc: 'Shift perspective',   icon: '◈' },
  { id: 'boost',   label: 'Boost',   desc: 'Build momentum',      icon: '◆' },
]

export default function ModeSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {MODES.map((mode) => {
        const active = value === mode.id
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            style={{
              flex: 1, padding: '12px 10px',
              borderRadius: 'var(--radius-md)',
              border: active
                ? '1px solid rgba(196,160,160,0.35)'
                : '1px solid var(--border-soft)',
              background: active
                ? 'linear-gradient(135deg, rgba(196,160,160,0.18), rgba(196,160,160,0.06))'
                : 'transparent',
              color: active ? 'var(--rose-bright)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{mode.icon}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.04em' }}>{mode.label}</div>
            <div style={{ fontSize: '0.68rem', color: active ? 'var(--text-secondary)' : 'var(--text-muted)', marginTop: 2 }}>
              {mode.desc}
            </div>
          </button>
        )
      })}
    </div>
  )
}

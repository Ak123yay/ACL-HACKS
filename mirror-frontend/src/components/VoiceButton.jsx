export default function VoiceButton({ isRecording, onToggle, disabled }) {
  const bars = [0, 1, 2, 3, 4]

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={isRecording ? 'Stop recording' : 'Tap to speak'}
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        border: isRecording ? '1.5px solid var(--rose)' : '1px solid var(--border)',
        background: isRecording
          ? 'linear-gradient(135deg, rgba(196,160,160,0.18), rgba(140,110,110,0.08))'
          : 'var(--bg-elevated)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.25s',
        animation: isRecording ? 'pulseRing 1.4s ease-out infinite' : 'none',
        flexShrink: 0,
      }}
    >
      {isRecording ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24 }}>
          {bars.map((i) => (
            <div
              key={i}
              style={{
                width: 3,
                borderRadius: 99,
                background: 'var(--rose)',
                animation: 'waveform 0.8s ease-in-out infinite',
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8"  y1="23" x2="16" y2="23"/>
        </svg>
      )}
    </button>
  )
}

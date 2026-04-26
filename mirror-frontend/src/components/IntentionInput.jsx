export default function IntentionInput({ value, onChange }) {
  return (
    <div>
      <label style={{
        fontSize: '0.72rem', color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'block', marginBottom: 8,
      }}>
        Intention for this session
      </label>
      <input
        className="input-field"
        placeholder="What do you want from this session?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        style={{ fontSize: '0.88rem' }}
      />
    </div>
  )
}

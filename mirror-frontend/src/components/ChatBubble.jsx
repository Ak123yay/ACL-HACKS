export default function ChatBubble({ message, isUser, isStreaming }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 14,
      animation: 'fadeIn 0.3s ease forwards',
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--rose-dim), var(--rose))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 10, marginTop: 4, flexShrink: 0,
          fontFamily: 'var(--font-display)', fontSize: 10,
          color: '#fff', letterSpacing: 1,
        }}>M</div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '11px 16px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, var(--rose-dim), rgba(140,110,110,0.55))'
          : 'var(--bg-elevated)',
        border: isUser ? 'none' : '1px solid var(--border-soft)',
        color: 'var(--text-primary)',
        fontSize: '0.88rem',
        lineHeight: 1.7,
      }}>
        {message.content}
        {isStreaming && (
          <span style={{
            display: 'inline-block', width: 5, height: 5,
            borderRadius: '50%', background: 'var(--rose)',
            marginLeft: 6, verticalAlign: 'middle',
            animation: 'breathe 0.9s ease-in-out infinite',
          }} />
        )}
      </div>
    </div>
  )
}

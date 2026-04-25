// frontend/src/components/ChatBubble.jsx
export default function ChatBubble({ role, content, isStreaming }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm
        ${isUser
          ? 'bg-mirror-500 text-white rounded-br-sm'
          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && <span className="inline-block w-1 h-4 ml-1 bg-mirror-400 animate-pulse" />}
        </p>
      </div>
    </div>
  )
}

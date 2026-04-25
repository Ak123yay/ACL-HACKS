// frontend/src/pages/Session.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useClone } from '../context/CloneContext'
import { useSSE } from '../hooks/useSSE'
import { useAudioPlayer } from '../hooks/useAudioPlayer'
import ModeSelector from '../components/ModeSelector'
import ChatBubble from '../components/ChatBubble'
import VoiceButton from '../components/VoiceButton'
import CrisisOverlay from '../components/CrisisOverlay'
import { startSession, endSession } from '../api/client'

export default function Session() {
  const { user, profile } = useAuth()
  const { persona, voiceId, mode, setMode } = useClone()
  const [sessionId, setSessionId] = useState(null)
  const [sessionActive, setSessionActive] = useState(false)
  const [intention, setIntention] = useState("")
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [crisisData, setCrisisData] = useState(null)
  const [showEndModal, setShowEndModal] = useState(false)
  const bottomRef = useRef(null)
  const { connectSSE } = useSSE()
  const { enqueueAudio, clearQueue } = useAudioPlayer()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, streamingText])

  async function handleStartSession() {
    const res = await startSession(user.id, mode, intention, moodBefore)
    setSessionId(res.data.session_id)
    setSessionActive(true)
    setMessages([])
    await sendMessage('(session started)')
  }

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return
    const userMsg = { role: "user", content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInputText("")
    setIsLoading(true)
    setStreamingText("")
    let fullResponse = ""
    await connectSSE('/api/chat/message',
      { user_id: user.id, session_id: sessionId, message: text, mode, intention,
        history: [{ role: "system", content: persona || "" }, ...newMessages.slice(-14)],
        voice_id: voiceId },
      { text: ({ token }) => { fullResponse += token; setStreamingText(fullResponse) },
        audio: ({ audio_b64 }) => enqueueAudio(audio_b64),
        crisis: (data) => setCrisisData(data),
        done: () => {
          setMessages(prev => [...prev, { role: "assistant", content: fullResponse }])
          setStreamingText("")
          setIsLoading(false)
        },
        error: () => setIsLoading(false) })
  }, [messages, mode, intention, persona, voiceId, sessionId, isLoading, connectSSE, enqueueAudio])

  async function handleEndSession() {
    await endSession(sessionId, user.id, messages, moodAfter)
    setSessionActive(false)
    clearQueue()
    setShowEndModal(false)
    window.location.href = '/journal'
  }
}

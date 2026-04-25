// frontend/src/hooks/useVoiceInput.js
import { useState, useRef, useCallback } from 'react'
import { transcribeAudio } from '../api/client'

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    chunksRef.current = []
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.start(250)
    mediaRef.current = mr
    setIsRecording(true)
    setTranscript("")
  }, [])

  const stopRecording = useCallback(() => new Promise(resolve => {
    const mr = mediaRef.current
    if (!mr) return resolve("")
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      setIsTranscribing(true)
      try {
        const res = await transcribeAudio(blob)
        const text = res.data.transcript || ""
        setTranscript(text)
        resolve(text)
      } catch { resolve("") } finally { setIsTranscribing(false) }
    }
    mr.stop()
    mr.stream.getTracks().forEach(t => t.stop())
    setIsRecording(false)
  }), [])

  return { isRecording, isTranscribing, transcript, startRecording, stopRecording }
}

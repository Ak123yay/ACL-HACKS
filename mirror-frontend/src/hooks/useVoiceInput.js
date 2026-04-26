import { useCallback, useRef, useState } from 'react'
import { transcribeAudio } from '../api/client'

export function useVoiceInput(onTranscript) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript,  setTranscript]  = useState('')
  const [error,       setError]       = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])

  const startRecording = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr     = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((t) => t.stop())
        try {
          const { data } = await transcribeAudio(blob)
          const text     = data.transcript || ''
          setTranscript(text)
          onTranscript?.(text)
        } catch {
          setError('Transcription failed. Try typing instead.')
        }
      }

      mr.start()
      mediaRecorderRef.current = mr
      setIsRecording(true)
    } catch {
      setError('Microphone access denied.')
    }
  }, [onTranscript])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }, [])

  const toggle = useCallback(() => {
    isRecording ? stopRecording() : startRecording()
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, transcript, error, startRecording, stopRecording, toggle }
}

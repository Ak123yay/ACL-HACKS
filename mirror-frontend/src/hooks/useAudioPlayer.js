import { useCallback, useRef, useState } from 'react'

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const queueRef    = useRef([])
  const playingRef  = useRef(false)
  const audioCtxRef = useRef(null)

  const getCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return audioCtxRef.current
  }

  const playNext = useCallback(async () => {
    if (playingRef.current || queueRef.current.length === 0) return
    playingRef.current = true
    setIsPlaying(true)
    const audioData = queueRef.current.shift()
    try {
      const ctx    = getCtx()
      const buffer = await ctx.decodeAudioData(audioData)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.onended = () => {
        playingRef.current = false
        if (queueRef.current.length > 0) playNext()
        else setIsPlaying(false)
      }
      source.start()
    } catch {
      playingRef.current = false
      if (queueRef.current.length > 0) playNext()
      else setIsPlaying(false)
    }
  }, [])

  const enqueueChunk = useCallback((base64Audio) => {
    const binary = atob(base64Audio)
    const bytes  = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    queueRef.current.push(bytes.buffer)
    playNext()
  }, [playNext])

  const clearQueue = useCallback(() => {
    queueRef.current = []
    playingRef.current = false
    setIsPlaying(false)
  }, [])

  return { isPlaying, enqueueChunk, clearQueue }
}

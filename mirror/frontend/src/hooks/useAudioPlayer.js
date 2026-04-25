// frontend/src/hooks/useAudioPlayer.js
import { useRef, useCallback } from 'react'

export function useAudioPlayer() {
  const queueRef = useRef([])
  const isPlayingRef = useRef(false)
  const ctxRef = useRef(null)

  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
    return ctxRef.current
  }

  async function playNext() {
    if (isPlayingRef.current || queueRef.current.length === 0) return
    isPlayingRef.current = true
    const audioB64 = queueRef.current.shift()
    try {
      const bytes = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0))
      const ctx = getCtx()
      const buffer = await ctx.decodeAudioData(bytes.buffer)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.onended = () => { isPlayingRef.current = false; playNext() }
      source.start()
    } catch { isPlayingRef.current = false; playNext() }
  }

  const enqueueAudio = useCallback((b64) => { queueRef.current.push(b64); playNext() }, [])
  const clearQueue = useCallback(() => { queueRef.current = []; isPlayingRef.current = false }, [])
  return { enqueueAudio, clearQueue }
}

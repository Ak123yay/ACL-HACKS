import { useCallback, useRef } from 'react'

export function useSSE({ onText, onAudio, onDone, onCrisis, onError } = {}) {
  const esRef = useRef(null)

  const connect = useCallback((eventSource) => {
    if (esRef.current) esRef.current.close()
    esRef.current = eventSource

    eventSource.addEventListener('text',   (e) => onText?.(e.data))
    eventSource.addEventListener('audio',  (e) => onAudio?.(e.data))
    eventSource.addEventListener('done',   ()  => { onDone?.(); eventSource.close() })
    eventSource.addEventListener('crisis', (e) => { onCrisis?.(JSON.parse(e.data)); eventSource.close() })
    eventSource.onerror = (e) => { onError?.(e); eventSource.close() }
  }, [onText, onAudio, onDone, onCrisis, onError])

  const disconnect = useCallback(() => {
    esRef.current?.close()
    esRef.current = null
  }, [])

  return { connect, disconnect }
}

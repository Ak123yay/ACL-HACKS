// frontend/src/hooks/useSSE.js
import { useCallback } from 'react'

export function useSSE() {
  const connectSSE = useCallback(async (url, body, handlers) => {
    const res = await fetch(url, { method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()
      let event = "message", data = ""
      for (const line of lines) {
        if (line.startsWith('event: ')) event = line.slice(7).trim()
        else if (line.startsWith('data: ')) {
          data = line.slice(6).trim()
          if (data && handlers[event]) {
            try { handlers[event](JSON.parse(data)) } catch { handlers[event]?.(data) }
          }
          event = "message"
        }
      }
    }
  }, [])
  return { connectSSE }
}

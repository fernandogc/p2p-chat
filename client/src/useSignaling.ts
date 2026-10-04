import React from 'react'
import type { SignalPayload } from './types'


export const useSignaling = (
  url: string,
  onSignal?: (data: SignalPayload) => void
) => {
  const [isConnected, setIsConnected] = React.useState(false)
  const wsRef = React.useRef<WebSocket | null>(null)

  React.useEffect(() => {
    let isDisposed = false
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      if (isDisposed) ws.close(1000, 'Component unmounted during connection')
      else setIsConnected(true)
    }

    ws.onclose = () => {
      if (!isDisposed) setIsConnected(false)
    }

    ws.onmessage = async (event: MessageEvent) => {
      if (isDisposed) return
      const rawText = event.data instanceof Blob ? await event.data.text() : event.data
      const data: SignalPayload = JSON.parse(rawText)
      onSignal?.(data)
    }

    return () => {
      isDisposed = true
      ws.onopen = null
      ws.onclose = null
      ws.onmessage = null
      if (ws.readyState === WebSocket.OPEN) ws.close(1000, 'Component unmounted')
      wsRef.current = null
      setIsConnected(false)
    }
  }, [url])

  // prevent effect re-triggering
  const sendSignal = (payload: SignalPayload) => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload))
  }

  return { sendSignal, isConnected }
}

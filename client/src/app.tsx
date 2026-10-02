import React from 'react'
import { styled } from '@linaria/react'
import { useSignaling } from './useSignaling'
import type { SignalPayload } from './types'

const Container = styled.div`
  font-family: sans-serif;
  padding: 1rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 640px) {
    padding: 2rem;
  }
`

const MessageBox = styled.div`
  border: 1px solid #ccc;
  min-height: 200px;
  overflow-y: auto;
  padding: 0.75rem;
  border-radius: 4px;
`

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const port = import.meta.env.SIGNALING_SERVER_PORT || 8080
const SIGNAL_URL = `${protocol}://localhost:${port}`

export const App = () => {
  const [myId] = React.useState<string>(() => 'peer-' + crypto.randomUUID().slice(0, 5))
  const [messages, setMessages] = React.useState<string[]>([])

  const addMessage = (msg: string) => setMessages((prev) => [...prev, msg])
  const onSignal = (data: SignalPayload) => {
    if (data.from !== myId) {
      addMessage(`Received '${data.type || 'signal'}' signal from ${data.from}`)
    }
  }

  const { sendSignal, isConnected } = useSignaling(SIGNAL_URL, onSignal)

  React.useEffect(() => {
    if (isConnected) {
      addMessage('Connected to signaling server')
      sendSignal({ type: 'join', from: myId })
    }
  }, [isConnected, myId, sendSignal])

  return (
    <Container>
      <h2>Signaling Test</h2>
      <p>Your ID: <strong>{myId}</strong></p>

      <MessageBox>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </MessageBox>
    </Container>
  )
}

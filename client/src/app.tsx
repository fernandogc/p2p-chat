import React from 'react'
import { styled } from '@linaria/react'
import { useMesh } from './useMesh'

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
  height: 50vh;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
`

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const port = import.meta.env.SIGNALING_SERVER_PORT || 8080
const SIGNAL_URL = `${protocol}://localhost:${port}`

export const App = () => {
  const [myId] = React.useState<string>(() => 'peer-' + crypto.randomUUID().slice(0, 5))
  const [draft, setDraft] = React.useState('')

  const { isConnected, messages, sendMessage } = useMesh(SIGNAL_URL, myId)

  const handleSend = () => {
    sendMessage(draft)
    setDraft('')
  }

  return (
    <Container>
      <h2>P2P Mesh Chat</h2>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'} | Your ID: <strong>{myId}</strong></p>

      <MessageBox>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.from}: </strong>{m.text}
          </div>
        ))}
      </MessageBox>

      <InputRow>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend}>Send</Button>
      </InputRow>
    </Container>
  )
}

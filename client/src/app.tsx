import React from 'react'
import { useMesh } from './useMesh'
import * as s from './components.tsx'


const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const port = import.meta.env.SIGNALING_SERVER_PORT || 8080
const SIGNAL_URL = `${protocol}://localhost:${port}`

export const App = () => {
  const [myId] = React.useState<string>(() => 'peer-' + crypto.randomUUID().slice(0, 5))
  const [draft, setDraft] = React.useState('')

  const { messages, sendMessage, activePeers } = useMesh(SIGNAL_URL, myId)

  const handleSend = () => {
    sendMessage(draft)
    setDraft('')
  }

  return (
    <s.Container>
      <h3>P2P Mesh Chat</h3>

      <s.StyledTabRoot defaultValue="chat">
        <s.StyledTabList>
          <s.StyledTab value="participants">
            Participants ({activePeers.length + 1})
          </s.StyledTab>
          <s.StyledTab value="chat">Chat</s.StyledTab>
        </s.StyledTabList>

        <s.StyledTabsPanel value="participants">
          <s.ParticipantList>
            <s.Participant>
              <strong>{myId}</strong> <em>(you)</em>
            </s.Participant>
            {activePeers.map((peerId) => (
              <s.Participant key={peerId}>{peerId}</s.Participant>
            ))}
          </s.ParticipantList>
        </s.StyledTabsPanel>

        <s.ChatTabPanel value="chat">
          <s.MessageBox>
            {messages.map((m, i) => (
              <s.Message key={i}>
                <strong>{m.from}</strong>
                <div>{m.text}</div>
              </s.Message>
            ))}
          </s.MessageBox>

          <s.InputRow>
            <s.Input
              name="message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write to everyone"
            />
            <s.Button onClick={handleSend}>➤</s.Button>
          </s.InputRow>
        </s.ChatTabPanel>
      </s.StyledTabRoot>
    </s.Container>
  )
}

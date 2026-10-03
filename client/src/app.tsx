import React from 'react'
import { useMesh } from './useMesh'
import { ChatView } from './chatView'
import * as s from './styledComponents.tsx'

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const port = import.meta.env.SIGNALING_SERVER_PORT || 8080
const SIGNAL_URL = `${protocol}://localhost:${port}`

type ParticipantListProps = {
  myId: string
  activePeers: string[]
}

const ParticipantsView: React.FC<ParticipantListProps> = ({ myId, activePeers }) => {
  return (
    <s.ParticipantList>
      <s.Participant>
        <strong>{myId}</strong> <em>(you)</em>
      </s.Participant>
      {activePeers.map((peerId) => (
        <s.Participant key={peerId}>{peerId}</s.Participant>
      ))}
    </s.ParticipantList>
  )
}

export const App = () => {
  const [myId] = React.useState<string>(() => 'peer-' + crypto.randomUUID().slice(0, 5))

  const { messages, sendMessage, editMessage, deleteMessage, activePeers } = useMesh(SIGNAL_URL, myId)

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
          <ParticipantsView myId={myId} activePeers={activePeers} />
        </s.StyledTabsPanel>

        <s.ChatTabPanel value="chat">
          <ChatView
            messages={messages}
            sendMessage={sendMessage}
            editMessage={editMessage}
            deleteMessage={deleteMessage}
          />
        </s.ChatTabPanel>
      </s.StyledTabRoot>
    </s.Container>
  )
}

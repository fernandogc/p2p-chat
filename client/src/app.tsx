import React from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { styled } from '@linaria/react'
import { useMesh } from './useMesh'

const Container = styled.div`
  font-family: sans-serif;
  padding: 1rem;
  width: 100%;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`

const StyledTabRoot = styled(Tabs.Root)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledTabList = styled(Tabs.List)`
  display: flex;
  gap: 0.5rem;
  padding: 4px;
  background-color: gainsboro;
  border-radius: 4px;
  margin-bottom: 1rem;
`

const StyledTab = styled(Tabs.Tab as React.ComponentType<any>)`
  padding: 1rem;
  font-size: 1rem;
  font-weight: bolder;
  border: none;
  cursor: pointer;
  flex: 1;
  background-color: transparent;
  border-radius: 4px;

  &[data-active] {
    background-color: white;
    color: dodgerblue;
  }

  &:hover:not([data-active]) {
    color: cornflowerblue;
  }
`

const ChatTabPanel = styled(Tabs.Panel as React.ComponentType<any>)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

const MessageBox = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  
  @media (min-width: 640px) {
    max-height: 500px;
  }
`

const Message = styled.div`
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const ParticipantList = styled.ul`
  height: 50vh;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 0 4px;
  border-radius: 4px;
  margin: 0;
  list-style-type: none;
`

const Participant = styled.li`
  margin-bottom: 1rem;
`

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid gainsboro;
  border-radius: 4px;
`

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;

  &::placeholder {
    color: gainsboro;
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  color: grey;
  border-width: 0;
  background-color: transparent;
`

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
    <Container>
      <h3>P2P Mesh Chat</h3>

      <StyledTabRoot defaultValue="chat">
        <StyledTabList>
          <StyledTab value="participants">
            Participants ({activePeers.length + 1})
          </StyledTab>
          <StyledTab value="chat">Chat</StyledTab>
        </StyledTabList>

        <Tabs.Panel value="participants">
          <ParticipantList>
            <Participant>
              <strong>{myId}</strong> <em>(you)</em>
            </Participant>
            {activePeers.map((peerId) => (
              <Participant key={peerId}>{peerId}</Participant>
            ))}
          </ParticipantList>
        </Tabs.Panel>

        <ChatTabPanel value="chat">
          <MessageBox>
            {messages.map((m, i) => (
              <Message key={i}>
                <strong>{m.from}</strong>
                <div>{m.text}</div>
              </Message>
            ))}
          </MessageBox>

          <InputRow>
            <Input
              name="message"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write to everyone"
            />
            <Button onClick={handleSend}>➤</Button>
          </InputRow>
        </ChatTabPanel>
      </StyledTabRoot>
    </Container>
  )
}

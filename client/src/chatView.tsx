import React from 'react'
import type { MessageItem } from './types'
import * as s from './styledComponents.tsx'


type MessageProps = {
  message: MessageItem
  selectedId: string | null
  handleToggleSelect: (id: string, isOwner: boolean, isDeleted: boolean) => void
  handleStartEdit: (id: string, text: string, e: React.MouseEvent) => void
  handleDelete: (id: string, e: React.MouseEvent) => void
}

const Message: React.FC<MessageProps> = ({message, selectedId, handleToggleSelect, handleStartEdit, handleDelete}) => {
  const isOwner = message.from === 'me'
  const isSelected = selectedId === message.id

  return (
    <s.Message
      $isOwner={isOwner && !message.isDeleted}
      $isSelected={isSelected}
      onClick={() => handleToggleSelect(message.id, isOwner, message.isDeleted ?? false)}
    >
      <s.MessageHeader>
        <strong>{message.from}</strong>
        {isOwner && isSelected && !message.isDeleted && (
          <s.MessageActions>
            <s.ActionButton onClick={(e) => handleStartEdit(message.id, message.text, e)}>
              ✎
            </s.ActionButton>
            <s.ActionButton onClick={(e) => handleDelete(message.id, e)}>
              ✕
            </s.ActionButton>
          </s.MessageActions>
        )}
      </s.MessageHeader>

      {message.isDeleted ? (
        <s.DeletedText>This message was deleted.</s.DeletedText>
      ) : (
        <div>
          {message.text}
          {message.isEdited && <s.EditedBadge>(edited)</s.EditedBadge>}
        </div>
      )}
    </s.Message>
  )
}

type ChatViewProps = {
  messages: MessageItem[]
  sendMessage: (text: string) => void
  editMessage: (id: string, text: string) => void
  deleteMessage: (id: string) => void
}

export const ChatView: React.FC<ChatViewProps> = ({messages, sendMessage, editMessage, deleteMessage}) => {
  const [draft, setDraft] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [editingId, setEditingId] = React.useState<string | null>(null)

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const handleToggleSelect = (id: string, isOwner: boolean, isDeleted: boolean) => {
    if (!isOwner || isDeleted) return
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const handleStartEdit = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(id)
    setDraft(text)
    setSelectedId(null)
    inputRef.current?.focus()
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setDraft('')
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteMessage(id)
    setSelectedId(null)
    if (editingId === id) {
      handleCancelEdit()
    }
  }

  const handleSubmit = () => {
    if (!draft.trim()) return

    if (editingId) {
      editMessage(editingId, draft)
      setEditingId(null)
    } else {
      sendMessage(draft)
    }
    setDraft('')
  }

  // todo: replace this rudimentary approach with virtualized strategy
  const messagesSlice = messages.slice(-500)

  return (
    <>
      <s.MessageBox>
        {messagesSlice.map((message) => <Message key={message.id} {...{message, selectedId, handleToggleSelect, handleStartEdit, handleDelete}}/>)}
      </s.MessageBox>

      {editingId && (
        <s.EditBanner>
          <span>Editing message</span>
          <s.CancelEditButton onClick={handleCancelEdit}>✕</s.CancelEditButton>
        </s.EditBanner>
      )}

      <s.InputRow $isEditing={Boolean(editingId)}>
        <s.Input
          ref={inputRef}
          name="message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={editingId ? 'Edit message...' : 'Write to everyone'}
        />
        <s.Button onClick={handleSubmit}>{editingId ? '✓' : '➤'}</s.Button>
      </s.InputRow>
    </>
  )
}

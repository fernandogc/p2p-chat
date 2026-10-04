import React from 'react'
import { styled } from '@linaria/react'
import { Tabs } from '@base-ui/react/tabs'

export const Container = styled.div`
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

export const StyledTabRoot = styled(Tabs.Root)`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const StyledTabList = styled(Tabs.List)`
  display: flex;
  gap: 0.5rem;
  padding: 4px;
  background-color: gainsboro;
  border-radius: 4px;
  margin-bottom: 1rem;
`

export const StyledTabsPanel = styled(Tabs.Panel as React.ComponentType<any>)``

export const StyledTab = styled(Tabs.Tab as React.ComponentType<any>)`
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

export const ChatTabPanel = styled(Tabs.Panel as React.ComponentType<any>)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const MessageBox = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`

export const Message = styled.div<{ $isSelected?: boolean; $isOwner?: boolean }>`
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.15s ease;
  cursor: ${(props) => (props.$isOwner ? 'pointer' : 'default')};
  background-color: ${(props) => (props.$isSelected ? '#f0f7ff' : 'transparent')};
  border: ${(props) => (props.$isSelected ? '1px solid #b3d8ff' : '1px solid transparent')};
`

export const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const MessageActions = styled.div`
  display: inline-flex;
  gap: 0.25rem;
`

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: grey;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  touch-action: manipulation;

  &:active {
    background-color: #e0e0e0;
  }
`

export const EditedBadge = styled.span`
  font-size: 0.75rem;
  color: gray;
  font-style: italic;
  margin-left: 0.25rem;
`

export const DeletedText = styled.div`
  color: gray;
  font-style: italic;
  padding-top: 0.25rem;
`

export const ParticipantList = styled.ul`
  height: 50vh;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding: 0 4px;
  border-radius: 4px;
  margin: 0;
  list-style-type: none;
`

export const Participant = styled.li`
  margin-bottom: 1rem;
`

export const EditBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background-color: #f0f0f0;
  border: 1px solid gainsboro;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  font-size: 0.85rem;
  color: #555;
`

export const CancelEditButton = styled.button`
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #888;
  padding: 0 0.25rem;

  &:hover {
    color: #333;
  }
`

export const InputRow = styled.div<{ $isEditing?: boolean }>`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid gainsboro;
  border-radius: ${(props) => (props.$isEditing ? '0 0 4px 4px' : '4px')};
`

export const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  font-size: 1rem;

  &::placeholder {
    color: gainsboro;
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`

export const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  color: grey;
  border-width: 0;
  background-color: transparent;
  cursor: pointer;
  touch-action: manipulation;
`

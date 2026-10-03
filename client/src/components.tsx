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

export const StyledTabsPanel = styled(Tabs.Panel as React.ComponentType<any>)`
`

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
  
  @media (min-width: 640px) {
    max-height: 500px;
  }
`

export const Message = styled.div`
  gap: 0.5rem;
  margin-bottom: 1rem;
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

export const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid gainsboro;
  border-radius: 4px;
`

export const Input = styled.input`
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

export const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  color: grey;
  border-width: 0;
  background-color: transparent;
`

// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMesh } from './useMesh'

// Stable mock reference prevents effect dependency re-render loops
const mockSendSignal = vi.fn()

vi.mock('./useSignaling', () => ({
  useSignaling: () => ({
    sendSignal: mockSendSignal,
    isConnected: true
  })
}))

// Minimal WebRTC stubs for jsdom execution
class MockRTCDataChannel {
  readyState = 'open'
  send = vi.fn()
  close = vi.fn()
}

class MockRTCPeerConnection {
  createDataChannel = vi.fn(() => new MockRTCDataChannel())
  createOffer = vi.fn(async () => ({ type: 'offer', sdp: '' }))
  createAnswer = vi.fn(async () => ({ type: 'answer', sdp: '' }))
  setLocalDescription = vi.fn(async () => {})
  setRemoteDescription = vi.fn(async () => {})
  addIceCandidate = vi.fn(async () => {})
  close = vi.fn()
}

;(globalThis as any).RTCPeerConnection = MockRTCPeerConnection
;(globalThis as any).RTCSessionDescription = class {}
;(globalThis as any).RTCIceCandidate = class {}

describe('useMesh state & actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty messages and activePeers', { timeout: 1000 }, () => {
    const { result } = renderHook(() => useMesh('ws://localhost:8080', 'peer-me'))

    expect(result.current.messages).toEqual([])
    expect(result.current.activePeers).toEqual([])
  })

  it('adds a message to state when sendMessage is invoked', { timeout: 1000 }, () => {
    const { result } = renderHook(() => useMesh('ws://localhost:8080', 'peer-me'))

    act(() => {
      result.current.sendMessage('Hello world')
    })

    expect(result.current.messages).toHaveLength(1)
    expect(result.current.messages[0]).toMatchObject({
      from: 'me',
      text: 'Hello world',
      isEdited: false,
      isDeleted: false
    })
  })

  it('updates text and sets isEdited to true when editMessage is invoked', { timeout: 1000 }, () => {
    const { result } = renderHook(() => useMesh('ws://localhost:8080', 'peer-me'))

    act(() => {
      result.current.sendMessage('Original message')
    })

    const targetId = result.current.messages[0].id

    const editedMessage = 'Edited message'
    act(() => {
      result.current.editMessage(targetId, editedMessage)
    })

    expect(result.current.messages[0]).toMatchObject({
      id: targetId,
      text: editedMessage,
      isEdited: true,
      isDeleted: false
    })
  })

  it('clears text and sets isDeleted to true when deleteMessage is invoked', { timeout: 1000 }, () => {
    const { result } = renderHook(() => useMesh('ws://localhost:8080', 'peer-me'))

    act(() => {
      result.current.sendMessage('To be deleted')
    })

    const targetId = result.current.messages[0].id

    act(() => {
      result.current.deleteMessage(targetId)
    })

    expect(result.current.messages[0]).toMatchObject({
      id: targetId,
      text: '',
      isDeleted: true
    })
  })
})

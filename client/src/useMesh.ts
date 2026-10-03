import React from 'react'
import { useSignaling } from './useSignaling'
import type { SignalPayload } from './types'

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

export const createMesh = (
  myId: string,
  sendSignal: (payload: SignalPayload) => void,
  onMessage?: (from: string, message: string) => void,
  onPeersChange?: (peers: string[]) => void
) => {
  const peers = new Map<string, RTCPeerConnection>()
  const channels = new Map<string, RTCDataChannel>()

  const notifyPeersChange = () => {
    onPeersChange?.(Array.from(channels.keys()))
  }

  const setupDataChannel = (peerId: string, channel: RTCDataChannel) => {
    channels.set(peerId, channel)
    channel.onopen = notifyPeersChange
    channel.onmessage = (event: MessageEvent) => {
      onMessage?.(peerId, event.data)
    }
    channel.onclose = () => {
      channels.delete(peerId)
      peers.delete(peerId)
      notifyPeersChange()
    }
  }

  const createPeerConnection = (targetId: string) => {
    const pc = new RTCPeerConnection(RTC_CONFIG)

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({type: 'ice-candidate', from: myId, target: targetId, candidate: event.candidate.toJSON()})
      }
    }

    pc.ondatachannel = (event) => {
      setupDataChannel(targetId, event.channel)
    }

    peers.set(targetId, pc)
    return pc
  }

  const connectToPeer = async (targetId: string) => {
    if (peers.has(targetId) || targetId === myId) return

    const pc = createPeerConnection(targetId)
    const channel = pc.createDataChannel('chat')
    setupDataChannel(targetId, channel)

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    sendSignal({type: 'offer', from: myId, target: targetId, sdp: offer})
  }

  const handleSignal = async (data: SignalPayload) => {
    if ('target' in data && data.target !== myId) return

    switch (data.type) {
      case 'join': {
        if (data.from !== myId) await connectToPeer(data.from)
        break
      }
      case 'offer': {
        const pc = createPeerConnection(data.from)
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        sendSignal({type: 'answer', from: myId, target: data.from, sdp: answer})
        break
      }
      case 'answer': {
        const pc = peers.get(data.from)
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.sdp))
        break
      }
      case 'ice-candidate': {
        const pc = peers.get(data.from)
        if (pc) await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        break
      }
    }
  }

  const broadcastMessage = (message: string) => {
    channels.forEach((channel) => {
      if (channel.readyState === 'open') channel.send(message)
    })
  }

  const destroy = () => {
    channels.forEach((ch) => ch.close())
    peers.forEach((pc) => pc.close())
    channels.clear()
    peers.clear()
    notifyPeersChange()
  }

  return {
    handleSignal,
    broadcastMessage,
    destroy
  }
}

type Mesh = ReturnType<typeof createMesh>

export const useMesh = (signalUrl: string, myId: string) => {
  const [messages, setMessages] = React.useState<Array<{ from: string; text: string }>>([])
  const [activePeers, setActivePeers] = React.useState<string[]>([])
  const meshRef = React.useRef<Mesh | null>(null)

  const handleMessage = (from: string, text: string) => {
    setMessages((prev) => [...prev, { from, text }])
  }

  const handleSignal = (data: SignalPayload) => {
    meshRef.current?.handleSignal(data)
  }

  const { sendSignal, isConnected } = useSignaling(signalUrl, handleSignal)

  React.useEffect(() => {
    if (!isConnected) return

    const mesh = createMesh(myId, sendSignal, handleMessage, setActivePeers)
    meshRef.current = mesh

    sendSignal({ type: 'join', from: myId })

    return () => {
      mesh.destroy()
      meshRef.current = null
    }
  }, [isConnected, myId, sendSignal])

  const sendMessage = React.useCallback((text: string) => {
    if (!text.trim()) return
    meshRef.current?.broadcastMessage(text)
    setMessages((prev) => [...prev, { from: 'me', text }])
  }, [])

  return { messages, sendMessage, activePeers }
}

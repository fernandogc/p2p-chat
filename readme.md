# P2P Real-Time Mesh Chat Application

A real-time, peer-to-peer (P2P) chat application built with React, TypeScript, and WebRTC DataChannels. The application supports multi-participant chat sessions, live presence indicators, message editing, and soft-deletes over direct peer connections.

### Architecture reasoning
- Low Latency & Privacy: Message payloads (chat, edits, deletions) travel directly between peers via RTCDataChannel without passing through a central application server.
- Minimal Server Overhead: The signaling server only facilitates initial WebRTC handshakes (offer, answer, ice-candidate, join). Once peers connect, server disconnects do not interrupt ongoing P2P communications.
- Scalability Trade-Off: While full mesh requires O(N^2) connection overhead, it is lightweight, serverless for messaging, and ideal for small-to-medium real-time sessions.

### Tech Stack
React, TypeScript, Linaria (Zero-runtime CSS-in-JS), Base-UI (Headless Material UI), Vitest.

---

## Message Protocol

All peer communications over RTCDataChannel use JSON-encoded strings conforming to the following payload contract:

### Payload Schema Types

1. Chat Message (CHAT_MESSAGE)
   Sent when a user broadcasts a new message.
```json
{
  "type": "CHAT_MESSAGE",
  "id": "msg-1710000000000-a1b2",
  "text": "Hello, world!"
}
```

2. Edit Message (EDIT_MESSAGE)
   Sent when a user updates an existing message.
```json
{
  "type": "EDIT_MESSAGE",
  "id": "msg-1710000000000-a1b2",
  "text": "Hello, world! (edited)"
}
```

3. Delete Message (DELETE_MESSAGE)
   Sent when a user deletes a message (soft-delete).
```json
{
  "type": "DELETE_MESSAGE",
   "id": "msg-1710000000000-a1b2"
}
```

---

## Testing Strategy

Automated unit tests focus on validating core message mutations, hook state management, and edge-case handling without opening actual browser sockets.

- Runner & Setup: Powered by Vitest + @testing-library/react running in a jsdom environment.
- WebRTC & Signaling Mocking: Standard WebRTC primitives (RTCPeerConnection, RTCDataChannel) and WebSocket signaling hooks are mocked with stable references to isolate pure component/hook state logic and avoid re-render loops.
- Coverage Areas:
    - Initial hook state (empty messages and active peer list).
    - Adding local chat messages (sendMessage).
    - Immutably updating message text and flag (isEdited: true) on edits.
    - Clearing text and setting flag (isDeleted: true) on soft deletes.

Run the test suite once with:
`yarn test`

---

## Trade-offs, Edge Cases & Future Improvements

### Addressed & Considered
1. Peer Disconnection & Reconnection:
   When a peer leaves or drops, RTCDataChannel.onclose cleans up peer references and updates presence state across connected clients immediately.
2. No Central Database / Source of Truth:
   In a pure P2P mesh, if all clients close their tabs, session history is lost. This is an intentional trade-off to keep the architecture fully client-side and serverless.

### What Could Be Improved With More Time
- Styled UI: Invest more time matching the provided mockups (color and spacing are still off). Consider requesting Figma (or similar) mockups for further guidance.
- New Participant Catch-Up: Send a SYNC_HISTORY payload over RTCDataChannel.onopen so new arrivals see prior context.
- Virtualized Message List: Implement or integrate windowing to efficiently render thousands of messages without DOM degradation.
- ICE Trickle Optimization & TURN Relay: Add fallback TURN servers (STUN/TURN) to guarantee connections across restrictive NATs and enterprise firewalls.
- End-to-End Encryption (E2EE): Encrypt data channel payloads using the Web Crypto API (AES-GCM) with per-room pre-shared keys.

---

## Build & Run Instructions

1. Install Dependencies:
   `yarn install`

2. Start Signaling Server:
   `yarn start:server`
   (Server listens on ws://localhost:8080)

3. Start Frontend Development Server:
   `yarn dev:client`
   Open http://localhost:5173 in two or more browser windows to simulate multiple peers.

---

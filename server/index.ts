import {WebSocketServer, WebSocket} from 'ws'

const port = Number(process.env.SIGNALING_SERVER_PORT) || 8080
const wss = new WebSocketServer({port})

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (raw) => {
    for (const client of wss.clients) {
      // broadcast to everyone except the sender
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(raw.toString())
      }
    }
  })
})

console.log(`Signaling server listening on port ${port}`)

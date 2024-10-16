const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })
const rooms = new Map()

wss.on('connection', (ws) => {
    console.log('New client connected')

    ws.on('message', (message) => {
        try {
            const chatMessage = JSON.parse(message)
            console.log('Message received: ', chatMessage)

            const { roomId } = chatMessage

            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set())
            }

            rooms.get(roomId).add(ws)
            rooms.get(roomId).forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(chatMessage))
                }
            })
        } catch (error) {
            console.error('Error parsing message: ', error)
        }
    })

    ws.on('close', () => {
        rooms.forEach((clients) => {
            clients.delete(ws)
        })
        console.log('Client disconnected')
    })
})

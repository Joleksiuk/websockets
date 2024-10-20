const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })
const rooms = new Map()

wss.on('connection', (ws) => {
    console.log('New client connected')

    ws.on('message', (message) => {
        try {
            const chatMessage = JSON.parse(message)
            console.log('Message received: ', chatMessage)

            const { roomId, username, activity } = chatMessage

            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set())
            }

            rooms.get(roomId).add(ws)

            if (activity === 'JOIN ROOM') {
                const joinNotification = {
                    activity: 'USER JOINED',
                    roomId,
                    username,
                    timestamp: Date.now(),
                    message: `${username} has joined the room.`,
                }

                broadcastToRoom(roomId, joinNotification)
            }

            broadcastToRoom(roomId, chatMessage)
        } catch (error) {
            console.error('Error parsing message: ', error)
        }
    })

    ws.on('close', () => {
        rooms.forEach((clients, roomId) => {
            if (clients.has(ws)) {
                clients.delete(ws)

                // Notify remaining users that someone has disconnected
                const disconnectNotification = {
                    activity: 'USER LEFT',
                    roomId,
                    username: 'Unknown', // You may want to track usernames per connection
                    timestamp: Date.now(),
                    message: 'A user has left the room.',
                }

                broadcastToRoom(roomId, disconnectNotification)
            }
        })

        console.log('Client disconnected')
    })
})

/**
 * Helper function to broadcast a message to all clients in a room.
 * @param {string} roomId - The ID of the room to send the message to.
 * @param {object} message - The message to broadcast.
 */
function broadcastToRoom(roomId, message) {
    if (rooms.has(roomId)) {
        rooms.get(roomId).forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message), (err) => {
                    if (err) {
                        console.error('Error sending message: ', err)
                    }
                })
            }
        })
    }
}

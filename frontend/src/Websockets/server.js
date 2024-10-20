const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })
const rooms = new Map()
const users = new Map()

wss.on('connection', (ws) => {
    console.log('New client connected')

    ws.on('message', (message) => {
        try {
            console.log('Received message: ', message)
            handleMessage(message, ws)
        } catch (error) {
            console.error('Error parsing message: ', error)
        }
    })

    ws.on('close', () => {
        try {
            handleUserLeftRoom(ws)
        } catch (error) {
            console.error('Error parsing message: ', error)
        }
    })
})

/**
 * Helper function to handle websocket messages from client
 * @param {MessageEvent} message - messageSent from the client.
 */
function handleMessage(message, ws) {
    try {
        const chatMessage = JSON.parse(message)
        const { activity } = chatMessage

        switch (activity) {
            case 'JOIN ROOM':
                console.log('Joining room')
                handleUserJoinedRoom(chatMessage, ws)
                break
            // case 'LEAVE ROOM':
            //     console.log('Leaving room')
            //     handleUserLeftRoom(roomId, username)
            //     break
            case 'CREATE ROOM':
                handleCreateRoom(chatMessage, ws)
                break
            case 'MESSAGE':
                handleUserSendChatMessage(chatMessage)
                break
            default:
                break
        }
    } catch (error) {
        console.error('Error parsing message: ', error)
    }
}

/**
 * Helper function to create a new chatroom
 * @param {MessageEvent} message - messageSent from the client.
 * @param {WebSocket} ws - The websocket connection which created the room.
 */
function handleCreateRoom(message, ws) {
    const { roomId } = message

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set())
        rooms.get(roomId).add(ws)
        console.log('Creating room with id: ', roomId)
        console.log('Current rooms: ', rooms)
    } else {
        console.log(
            `Unable to create room with id : ${roomId} - Room already exists`,
        )
        console.log('Current rooms: ', rooms)
    }
}

/**
 * Helper function to handle user joining a room
 * @param {MessageEvent} message - messageSent from the client.
 */
function handleUserJoinedRoom(message, ws) {
    const { roomId, username } = message

    const joinNotification = {
        activity: 'USER JOINED ROOM',
        roomId,
        username,
        timestamp: Date.now(),
        message: `${username} has joined the room.`,
    }
    if (!rooms.has(roomId)) {
        rooms.get(roomId).add(ws)
        broadcastToRoom(roomId, joinNotification)
    } else {
        console.log(
            `${username} is unable to join room with id : ${roomId} - Room does not exist`,
        )
    }
}

/**
 * Helper function to handle user leaving a room
 * @param {MessageEvent} message - messageSent from the client.
 */
function handleUserLeftRoom(message, ws) {
    const { roomId, username } = message

    rooms.forEach((clients, roomId) => {
        if (clients.has(ws)) {
            clients.delete(ws)

            const disconnectNotification = {
                activity: 'USER LEFT ROOM',
                roomId: roomId,
                username: users.get(ws),
                timestamp: Date.now(),
                message: 'A user has left the room.',
            }

            broadcastToRoom(roomId, disconnectNotification)
        }
    })
}

/**
 * Helper function to handle user sending a chat message
 * @param {MessageEvent} message - messageSent from the client.
 */
function handleUserSendChatMessage(message) {
    const { roomId, username } = message
    const chatMessage = {
        activity: 'USER SENT MESSAGE',
        roomId,
        username,
        timestamp: Date.now(),
        message: message.message,
    }
    console.log('Current rooms: ', rooms)
    console.log('Sending message: ', chatMessage)
    broadcastToRoom(roomId, chatMessage)
}

/**
 * Helper function to broadcast a message to all clients in a room.
 * @param {string} roomId - The ID of the room to send the message to.
 * @param {MessageEvent} message - The message to broadcast.
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

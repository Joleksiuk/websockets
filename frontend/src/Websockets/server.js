const WebSocket = require('ws')
const crypto = require('crypto')

const wss = new WebSocket.Server({ port: 8080 })
const rooms = new Map()
const users = new Map()

/**
 * Helper function to create a random ID
 * @param {number} length - The length of the generated ID.
 * @returns {string} - The generated ID.
 */
function generateId(length) {
    return crypto.randomBytes(length).toString('hex')
}

wss.on('connection', (ws) => {
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
 * Helper function to create a new chatroom with auto-generated roomId, password, and cipherKey
 * @param {MessageEvent} message - messageSent from the client.
 * @param {WebSocket} ws - The websocket connection which created the room.
 */
function handleCreateRoom(message, ws) {
    const roomId = generateId(4)
    const password = generateId(4)

    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            users: new Set([ws]),
            chatroomName: message.chatroomName || 'Untitled Room',
            isOpen: message.isOpen ?? true,
            password, // Store the generated password
        })

        console.log(
            `Creating room with id: ${roomId}, name: ${message.chatroomName}, password: ${password}`,
        )

        // Send back the roomId, password, and cipherKey to the user who created the room
        ws.send(
            JSON.stringify({
                activity: 'ROOM CREATED',
                roomId,
                password,
            }),
        )
    } else {
        console.log(
            `Unable to create room with id: ${roomId} - Room already exists`,
        )
    }
}

/**
 * Helper function to handle user joining a room
 * @param {MessageEvent} message - messageSent from the client.
 * @param {WebSocket} ws - The websocket connection trying to join.
 */
function handleUserJoinedRoom(message, ws) {
    const { roomId, username, password } = message

    if (rooms.has(roomId)) {
        const room = rooms.get(roomId)

        // Check if the room is password protected
        if (room.password && room.password !== password) {
            ws.send(
                JSON.stringify({
                    activity: 'INVALID AUTHENTICATION',
                }),
            )
            return
        }

        const joinNotification = {
            activity: 'USER JOINED ROOM',
            roomId,
            username,
            timestamp: Date.now(),
            message: `${username} has joined the room.`,
        }

        room.users.add(ws) // Add the user to the room
        broadcastToRoom(roomId, joinNotification)
    } else {
        console.log(
            `${username} is unable to join room with id: ${roomId} - Room does not exist`,
        )
    }
}

/**
 * Helper function to handle user leaving a room
 * @param {WebSocket} ws - The websocket connection leaving the room.
 */
function handleUserLeftRoom(ws) {
    rooms.forEach((room, roomId) => {
        if (room.users.has(ws)) {
            room.users.delete(ws)

            const disconnectNotification = {
                activity: 'USER LEFT ROOM',
                roomId,
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
        const room = rooms.get(roomId) // Get the room object
        room.users.forEach((client) => {
            // Access the users set
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

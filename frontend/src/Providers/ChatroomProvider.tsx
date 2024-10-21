import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ClientMessage, ServerMessage } from './Models'
import { useNavigate, useParams } from 'react-router-dom'
import { useWebsocketContext } from './WebsocketProvider'

interface ChatroomContextType {
    chatroomId: string | undefined
    createChatroom: (name: string, username: string) => void
    joinChatroom: (chatroomId: string, username: string) => void
    messages: ServerMessage[]
    sendMessage: (content: string, username: string) => void
    chatroomUsers: string[]
    setChatroomUsers: (users: string[]) => void
}

const ChatroomContext = createContext<ChatroomContextType | undefined>(
    undefined,
)

interface ChatroomProviderProps {
    children: ReactNode
}

export const ChatroomProvider: React.FC<ChatroomProviderProps> = ({
    children,
}) => {
    const [messages, setMessages] = useState<ServerMessage[]>([])
    const [chatroomUsers, setChatroomUsers] = useState<string[]>([])

    const { ws } = useWebsocketContext()

    const { chatroomId } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        ws.onmessage = (event: MessageEvent) => {
            handleMessageFromWebsocketServer(event)
        }
    }, [ws])

    const handleMessageFromWebsocketServer = (event: MessageEvent) => {
        try {
            const message: ServerMessage = JSON.parse(event.data)
            console.log('Received message:', message)

            switch (message.activity) {
                case 'USER SENT MESSAGE':
                    setMessages((prevMessages) => [...prevMessages, message])
                    break
                case 'USER JOINED ROOM':
                    setChatroomUsers((prevUsers) => [
                        ...prevUsers,
                        message.username,
                    ])
                    break
                case 'USER LEFT ROOM':
                    setChatroomUsers((prevUsers) =>
                        prevUsers.filter((user) => user !== message.username),
                    )
                    break
                default:
                    console.log('Unknown message type:', message)
            }
        } catch (error) {
            console.error('Error processing WebSocket message', error)
        }
    }

    const sendMessage = (content: string, username: string) => {
        if (!chatroomId) {
            console.error('No chatroomId set! Cannot send message.')
            return
        }

        const chatMessage: ClientMessage = {
            activity: 'MESSAGE',
            roomId: chatroomId,
            username: username,
            timestamp: Date.now(),
            message: content,
        }

        sendWebsocketMessageToServer(chatMessage)
    }

    const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const createChatroom = async (name: string, username: string) => {
        const roomId = Math.random().toString(36).substr(2, 16)
        const chatMessage: ClientMessage = {
            activity: 'CREATE ROOM',
            roomId: roomId,
            username: username,
            timestamp: Date.now(),
            message: 'User has created the chatroom',
        }
        sendWebsocketMessageToServer(chatMessage)
        joinChatroom(roomId, username)
        navigate(`/chatroom/${roomId}`)
    }

    const joinChatroom = (chatroomId: string, username: string) => {
        const chatMessage: ClientMessage = {
            activity: 'JOIN ROOM',
            roomId: chatroomId,
            username: username,
            timestamp: Date.now(),
            message: 'User has joined the chatroom',
        }
        sendWebsocketMessageToServer(chatMessage)
        navigate(`/chatroom/${chatroomId}`)
    }

    const sendWebsocketMessageToServer = async (message: ClientMessage) => {
        let messageSent = false
        let currentAttempts = 0
        const maxAttempts = 2
        while (!messageSent && currentAttempts < maxAttempts) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message))
                messageSent = true
            } else {
                console.log('Connection is not open')
                currentAttempts++
                await sleep(1000)
            }
        }
    }

    return (
        <ChatroomContext.Provider
            value={{
                chatroomId,
                messages,
                chatroomUsers,
                createChatroom,
                joinChatroom,
                sendMessage,
                setChatroomUsers,
            }}
        >
            {children}
        </ChatroomContext.Provider>
    )
}

export const useChatroomContext = (): ChatroomContextType => {
    const context = useContext(ChatroomContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

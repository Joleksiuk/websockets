import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ChatroomActivity } from './Models'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'

interface ChatroomContextType {
    chatroomId: string | undefined
    createChatroom: (name: string, username: string) => void
    joinChatroom: (chatroomId: string, username: string) => void
    messages: ChatroomActivity[]
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
    const [messages, setMessages] = useState<ChatroomActivity[]>([])
    const [chatroomUsers, setChatroomUsers] = useState<string[]>([])

    const [ws, setWs] = useState<WebSocket | null>(null)
    const [isWsConnected, setIsWsConnected] = useState(false)

    const { chatroomId } = useParams()
    const { user } = useAuthContext()

    const navigate = useNavigate()

    useEffect(() => {
        if (chatroomId && user) joinChatroom(chatroomId, user)
    }, [isWsConnected])

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')

        socket.onopen = () => {
            setIsWsConnected(true)
        }

        socket.onmessage = (event) => {
            console.log('Raw message received:', event.data)
            handleWsMessage(event)
        }

        socket.onclose = () => {
            console.log('Disconnected from WebSocket')
            setIsWsConnected(false)
        }

        setWs(socket)
        return () => {
            socket.close()
        }
    }, [])

    const handleWsMessage = (event: MessageEvent) => {
        try {
            const message: ChatroomActivity = JSON.parse(event.data)
            switch (message.activity) {
                case 'MESSAGE':
                    setMessages((prevMessages) => [...prevMessages, message])
                    break
                case 'JOIN ROOM':
                    setChatroomUsers((prevUsers) => [
                        ...prevUsers,
                        message.username,
                    ])
                    break
                case 'LEAVE ROOM':
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

        const chatMessage: ChatroomActivity = {
            activity: 'MESSAGE',
            roomId: chatroomId,
            username: username,
            timestamp: Date.now(),
            message: content,
        }

        sendMessageViaWs(chatMessage)
    }

    const createChatroom = (name: string, username: string) => {
        const chatMessage: ChatroomActivity = {
            activity: 'CREATE ROOM',
            roomId: Math.random().toString(36).substr(2, 16),
            username: username,
            timestamp: Date.now(),
            message: 'User has created the chatroom',
        }
        sendMessageViaWs(chatMessage)
    }

    const joinChatroom = (chatroomId: string, username: string) => {
        const chatMessage: ChatroomActivity = {
            activity: 'JOIN ROOM',
            roomId: chatroomId,
            username: username,
            timestamp: Date.now(),
            message: 'User has joined the chatroom',
        }
        sendMessageViaWs(chatMessage)
        navigate(`/chatroom/${chatroomId}`)
    }

    const sendMessageViaWs = (message: ChatroomActivity) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message))
        } else {
            console.log('Connection is not open')
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

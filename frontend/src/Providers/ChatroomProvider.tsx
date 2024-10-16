import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ChatroomActivity } from './Models'

interface ChatroomContextType {
    chatroomId: string
    chatroomName: string
    setChatroomName: (name: string) => void
    createChatroom: (name: string, username: string) => void
    joinChatroom: (chatroomId: string, username: string) => void
    messages: ChatroomActivity[]
    sendMessage: (content: string, username: string) => void
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
    const [chatroomName, setChatroomName] = useState<string>('Default')
    const [chatroomId, setChatroomId] = useState<string>('')
    const [messages, setMessages] = useState<ChatroomActivity[]>([])
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [isWsConnected, setIsWsConnected] = useState(false)

    const onUserConnected = (username: string) => {
        console.log('Connected to WebSocket')
    }

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080')

        socket.onopen = () => {
            console.log('WebSocket connection opened')
            setIsWsConnected(true) // Set connected status here
            onUserConnected('User')
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            addMessage(message)
        }

        socket.onclose = () => {
            console.log('Disconnected from WebSocket')
            setIsWsConnected(false)
        }

        setWs(socket) // Set ws here

        return () => {
            socket.close()
        }
    }, [])

    const addMessage = (message: ChatroomActivity) => {
        setMessages((prevMessages) => [...prevMessages, message])
    }

    const sendMessage = (content: string, username: string) => {
        if (!chatroomId) {
            console.error('No chatroomId set! Cannot send message.')
            return
        }

        const chatMessage = {
            activity: 'MESSAGE',
            roomId: chatroomId, // Use the actual chatroomId instead of generating a new one
            username: username,
            timestamp: Date.now(),
            message: content,
        }

        console.log('WebSocket readyState:', ws?.readyState) // Log the WebSocket state

        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('Sending message:', JSON.stringify(chatMessage))
            ws.send(JSON.stringify(chatMessage))
        } else {
            console.log('WebSocket connection is not open')
        }
    }

    const generateChatroomId = () => {
        const id = Math.random().toString(36).substr(2, 16)
        setChatroomId(id)
        return id
    }

    const createChatroom = (name: string, username: string) => {
        const newRoomId = generateChatroomId()
        setChatroomName(name)
        setChatroomId(newRoomId)

        const chatMessage: ChatroomActivity = {
            activity: 'CREATE ROOM',
            roomId: newRoomId,
            username: username,
            timestamp: Date.now(),
            message: 'User has created the chatroom',
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(chatMessage))
        } else {
            console.log('Connection is not open')
        }
    }

    const joinChatroom = (chatroomId: string, username: string) => {
        const chatMessage: ChatroomActivity = {
            activity: 'JOIN ROOM',
            roomId: chatroomId,
            username: username,
            timestamp: Date.now(),
            message: 'User has joined the chatroom',
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(chatMessage))
        } else {
            console.log('Connection is not open')
        }
    }

    return (
        <ChatroomContext.Provider
            value={{
                chatroomName,
                setChatroomName,
                chatroomId,
                createChatroom,
                joinChatroom,
                messages,
                sendMessage,
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

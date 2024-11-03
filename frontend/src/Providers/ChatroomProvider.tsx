import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ClientMessage, ServerMessage } from './Models'
import { useParams } from 'react-router-dom'
import { useWebsocketContext } from './WebsocketProvider'
import { useAuthContext } from './AuthProvider'

interface ChatroomContextType {
    messages: ServerMessage[]
    sendMessage: (content: string, username: string) => void
    chatroomUsers: string[]
    setChatroomUsers: (users: string[]) => void
    isAuthenticated: boolean
    setIsAuthenticated: (isAuthenticated: boolean) => void
    hasInvalidPassword: boolean
    setHasInvalidPassword: (hasInvalidPassword: boolean) => void
    joinChatroom: (
        chatroomId: string,
        username: string,
        password: string,
    ) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [hasInvalidPassword, setHasInvalidPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    const { chatroomId } = useParams()
    const { getPassword, user, rooms, setRooms } = useAuthContext()
    const { wsMessages, setWsMessages, sendWebsocketMessageToServer } =
        useWebsocketContext()

    useEffect(() => {
        if (wsMessages.length > 0) {
            const lastMessage = wsMessages.pop()
            setWsMessages([...wsMessages])
            if (lastMessage) {
                handleMessageFromWebsocketServer(lastMessage)
            }
        }
    }, [wsMessages])

    useEffect(() => {
        if (!chatroomId || !getPassword(chatroomId)) {
            return
        }

        if (chatroomId && user) {
            const chatMessage: ClientMessage = {
                activity: 'JOIN ROOM',
                roomId: chatroomId,
                password: getPassword(chatroomId),
                username: user,
                timestamp: Date.now(),
                message: '',
            }
            sendWebsocketMessageToServer(chatMessage)
        }
    }, [user, chatroomId, getPassword, sendWebsocketMessageToServer])

    const handleMessageFromWebsocketServer = (event: MessageEvent) => {
        try {
            const message: ServerMessage = JSON.parse(event.data)

            switch (message.activity) {
                case 'USER SENT MESSAGE':
                    setMessages((prevMessages) => [...prevMessages, message])
                    break
                case 'USER JOINED ROOM':
                    setChatroomUsers((prevUsers) => {
                        if (!prevUsers.includes(message.username)) {
                            return [...prevUsers, message.username]
                        }
                        return prevUsers
                    })
                    setIsAuthenticated(true)
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

    const joinChatroom = (
        roomId: string,
        username: string,
        password: string,
    ) => {
        if (!password) {
            console.error('No password set! Cannot join chatroom.')
            return
        }
        const chatMessage: ClientMessage = {
            activity: 'JOIN ROOM',
            password,
            roomId,
            username,
            timestamp: Date.now(),
            message: 'User has joined the chatroom',
        }

        const updatedRooms = rooms.map((room) =>
            room.roomId === roomId ? { ...room, password } : room,
        )

        if (!updatedRooms.some((room) => room.roomId === roomId)) {
            updatedRooms.push({ roomId, password })
        }

        setRooms(updatedRooms)
        sendWebsocketMessageToServer(chatMessage)
    }

    const sendMessage = (content: string, username: string) => {
        if (!chatroomId) {
            console.error('No chatroomId set! Cannot send message.')
            return
        }

        const chatMessage: ClientMessage = {
            activity: 'MESSAGE',
            roomId: chatroomId,
            password: getPassword(chatroomId),
            username: username,
            timestamp: Date.now(),
            message: content,
        }

        sendWebsocketMessageToServer(chatMessage)
    }

    return (
        <ChatroomContext.Provider
            value={{
                messages,
                chatroomUsers,
                isAuthenticated,
                hasInvalidPassword,
                sendMessage,
                setChatroomUsers,
                setIsAuthenticated,
                setHasInvalidPassword,
                joinChatroom,
                isLoading,
                setIsLoading,
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

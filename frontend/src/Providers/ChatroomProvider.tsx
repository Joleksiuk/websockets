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
import { getRoomById, Room, RoomUser } from '../Services/ChatroomService'

interface ChatroomContextType {
    room: Room | undefined
    messages: ServerMessage[]
    isLoading: boolean
    chatroomUsers: string[]
    isAuthenticated: boolean
    sendMessage: (content: string, username: string) => void
    setIsLoading: (isLoading: boolean) => void
    setChatroomUsers: (users: string[]) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
    joinChatroom: (
        chatroomId: string,
        username: string,
        password: string,
    ) => void
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
    const [room, setRoom] = useState<Room>()
    const [messages, setMessages] = useState<ServerMessage[]>([])
    const [allChatroomUsers, setAllChatroomUsers] = useState<RoomUser[]>([])
    const [activeChatroomUsers, setActiveChatroomUsers] = useState<string[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    const { chatroomId } = useParams()
    const { user } = useAuthContext()
    const {
        isConnected,
        wsMessages,
        setWsMessages,
        sendWebsocketMessageToServer,
        connectToWebsocketServer,
    } = useWebsocketContext()

    useEffect(() => {
        initializeRoom()
    }, [])

    useEffect(() => {
        if (chatroomId && user) {
            const chatMessage: ClientMessage = {
                activity: 'JOIN ROOM',
                roomId: chatroomId,
                username: user.username,
                timestamp: Date.now(),
                message: '',
            }
            sendWebsocketMessageToServer(chatMessage)
        }
    }, [isConnected])

    useEffect(() => {
        if (wsMessages.length > 0) {
            const lastMessage = wsMessages.pop()
            setWsMessages([...wsMessages])
            if (lastMessage) {
                handleMessageFromWebsocketServer(lastMessage)
            }
        }
    }, [wsMessages])

    const initializeRoom = async () => {
        if (chatroomId && user) {
            try {
                setIsLoading(true)
                const room: Room = await getRoomById(chatroomId)
                setRoom(room)

                if (room !== undefined) {
                    setIsAuthenticated(true)
                    if (!isConnected) {
                        connectToWebsocketServer()
                    }
                }
            } catch (error) {
                console.error('Error fetching room:', error)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleMessageFromWebsocketServer = (event: MessageEvent) => {
        try {
            const message: ServerMessage = JSON.parse(event.data)

            switch (message.activity) {
                case 'USER SENT MESSAGE':
                    setMessages((prevMessages) => [...prevMessages, message])
                    break
                case 'USER JOINED ROOM':
                    if (
                        message.username === null ||
                        message.username === undefined ||
                        message.username.trim() === ''
                    ) {
                        return
                    }
                    setActiveChatroomUsers((prevUsers) => {
                        if (!prevUsers.includes(message.username)) {
                            return [...prevUsers, message.username]
                        }
                        return prevUsers
                    })
                    break
                case 'USER LEFT ROOM':
                    setActiveChatroomUsers((prevUsers) =>
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
            roomId,
            username,
            timestamp: Date.now(),
            message: 'User has joined the chatroom',
        }
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
            username: username,
            timestamp: Date.now(),
            message: content,
        }

        sendWebsocketMessageToServer(chatMessage)
    }

    return (
        <ChatroomContext.Provider
            value={{
                room,
                isLoading,
                messages,
                chatroomUsers: activeChatroomUsers,
                isAuthenticated,
                sendMessage,
                setChatroomUsers: setActiveChatroomUsers,
                setIsAuthenticated,
                joinChatroom,
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

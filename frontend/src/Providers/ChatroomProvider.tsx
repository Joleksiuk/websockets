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
import {
    addUserToChatroom,
    getRoomById,
    Room,
} from '../Services/ChatroomService'
import { useUsersContext } from './UserProvider'

interface ChatroomContextType {
    room: Room | undefined
    messages: ServerMessage[]
    isLoading: boolean
    chatroomUsers: ChatroomUser[]
    isAuthenticated: boolean
    sendMessage: (content: string, username: string) => void
    addChatroomUser: (userId: number) => void
    removeChatroomUser: (username: string) => void
    setIsAuthenticated: (isAuthenticated: boolean) => void
}

const ChatroomContext = createContext<ChatroomContextType | undefined>(
    undefined,
)

interface ChatroomProviderProps {
    children: ReactNode
}

export type ChatroomUser = {
    id: number
    username: string
    isActive: boolean
}

export const ChatroomProvider: React.FC<ChatroomProviderProps> = ({
    children,
}) => {
    const [room, setRoom] = useState<Room>()
    const [messages, setMessages] = useState<ServerMessage[]>([])
    const [chatroomUsers, setChatroomUsers] = useState<ChatroomUser[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    const { chatroomId } = useParams()
    const { user } = useAuthContext()
    const { allUsers } = useUsersContext()

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
        if (isConnected && chatroomId && user) {
            const chatMessage: ClientMessage = {
                activity: 'JOIN ROOM',
                roomId: chatroomId,
                username: user.username,
                timestamp: Date.now(),
                message: 'User has joined the chatroom',
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
                    const updatedChatroomUsers = room.authorizedUsers.map(
                        (user) => {
                            return {
                                id: user.id,
                                username: user.username,
                                isActive: false,
                            }
                        },
                    )
                    setChatroomUsers(updatedChatroomUsers)
                    connectToWebsocketServer()
                }
            } catch (error) {
                console.error('Error fetching room:', error)
                setIsAuthenticated(false)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const setActivityStatusForUser = (username: string, isActive: boolean) => {
        setChatroomUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user.username === username) {
                    return { ...user, isActive }
                }
                return user
            })
            return updatedUsers
        })
    }

    const addChatroomUser = async (userId: number) => {
        try {
            if (chatroomId) {
                await addUserToChatroom(chatroomId, userId)

                const user = allUsers.find((user) => user.id === userId)
                if (user) {
                    const newChatroomUser: ChatroomUser = {
                        id: chatroomUsers.length,
                        username: user.username,
                        isActive: false,
                    }
                    setChatroomUsers((prevUsers) => [
                        ...prevUsers,
                        newChatroomUser,
                    ])
                }
            }
        } catch (error) {
            console.error('Error adding user to chatroom:', error)
        }
    }

    const removeChatroomUser = (username: string) => {
        setChatroomUsers((prevUsers) =>
            prevUsers.filter((user) => user.username !== username),
        )
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
                    setActivityStatusForUser(message.username, true)
                    break
                case 'USER LEFT ROOM':
                    setActivityStatusForUser(message.username, false)
                    break
                default:
                    console.error('Unknown message type:', message)
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

    return (
        <ChatroomContext.Provider
            value={{
                room,
                isLoading,
                messages,
                chatroomUsers,
                isAuthenticated,
                sendMessage,
                addChatroomUser,
                removeChatroomUser,
                setIsAuthenticated,
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

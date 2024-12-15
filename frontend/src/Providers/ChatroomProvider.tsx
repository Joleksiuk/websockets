/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { useParams } from 'react-router-dom'
import { useWebsocketContext } from './WebsocketProvider'
import { useAuthContext } from './AuthProvider'
import {
    addUserToChatroom,
    getRoomById,
    Room,
} from '../Services/ChatroomService'
import { useUsersContext } from './UserProvider'
import {
    ClientMessage,
    ServerMessage,
    UserChatMessageServerMessagePayload,
    UserJoinedServerMessage,
    UserLeftServerMessage,
    UserSentChatMessageClientMessage,
} from './ws/WebsocketDataModels'

interface ChatroomContextType {
    room: Room | undefined
    messages: ChatroomMessage[]
    isLoading: boolean
    chatroomUsers: ChatroomUser[]
    isAuthenticated: boolean
    sendMessage: (content: string, username: string) => void
    joinChatroom: () => void
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

type ChatroomMessage = UserChatMessageServerMessagePayload

export const ChatroomProvider: React.FC<ChatroomProviderProps> = ({
    children,
}) => {
    const [room, setRoom] = useState<Room>()
    const [messages, setMessages] = useState<ChatroomMessage[]>([])
    const [chatroomUsers, setChatroomUsers] = useState<ChatroomUser[]>([])
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    const { chatroomId } = useParams()
    const { user } = useAuthContext()
    const { allUsers } = useUsersContext()

    const {
        wsMessages,
        setWsMessages,
        connectToWebsocketServer,
        sendWebsocketMessageToServer,
    } = useWebsocketContext()

    useEffect(() => {
        initializeRoom()
    }, [])

    useEffect(() => {
        if (wsMessages.length > 0) {
            const lastMessage = wsMessages.pop()
            setWsMessages([...wsMessages])
            if (lastMessage) {
                handleMessageFromWebsocketServer(lastMessage)
            }
        }
    }, [wsMessages])

    const joinChatroom = () => {
        if (user && chatroomId) {
            const clientMessage: ClientMessage = {
                eventName: 'JOIN ROOM',
                payload: {
                    roomId: Number(chatroomId),
                    userId: user.userId,
                },
            }
            sendWebsocketMessageToServer(clientMessage)
        }
    }

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

    const setActivityStatusForUser = (userId: number, isActive: boolean) => {
        setChatroomUsers((prevUsers) => {
            const updatedUsers = prevUsers.map((user) => {
                if (user.id === userId) {
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

            switch (message.eventName) {
                case 'USER SENT CHAT MESSAGE':
                    const chatroomMessage =
                        message.payload as UserChatMessageServerMessagePayload
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        chatroomMessage,
                    ])
                    break
                case 'USER JOINED ROOM':
                    handleUserJoinedRoom(message as UserJoinedServerMessage)
                    break
                case 'USER LEFT ROOM':
                    const userLeftMessage = message as UserLeftServerMessage
                    setActivityStatusForUser(
                        userLeftMessage.payload.userId,
                        false,
                    )
                    break
                case 'SERVER CLOSED':
                    break
                default:
                    console.error('Unknown message type:', message)
            }
        } catch (error) {
            console.error('Error processing WebSocket message', error)
        }
    }

    const handleUserJoinedRoom = (message: UserJoinedServerMessage) => {
        const { roomId, activeUsers } = message.payload
        if (roomId === Number(chatroomId)) {
            activeUsers.forEach((user) => {
                setActivityStatusForUser(user.userId, true)
            })
        }
    }

    const sendMessage = (content: string, username: string) => {
        if (!chatroomId || !user) {
            console.error('No chatroomId set! Cannot send message.')
            return
        }
        const chatMessage: UserSentChatMessageClientMessage = {
            eventName: 'SEND CHAT MESSAGE',
            payload: {
                roomId: Number(chatroomId),
                userId: user.userId,
                message: content,
            },
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
                joinChatroom,
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

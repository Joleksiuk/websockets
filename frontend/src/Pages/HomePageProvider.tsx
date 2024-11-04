import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { ClientMessage, ServerMessage } from '../Providers/Models'
import { useWebsocketContext } from '../Providers/WebsocketProvider'
import { Room, useAuthContext } from '../Providers/AuthProvider'

interface HomepageContextType {
    isLoading: boolean
    hasInvalidPassword: boolean
    setHadInvalidPassword: (hasInvalidPassword: boolean) => void
    createChatroom: (name: string, username: string) => void
    joinChatroom: (
        chatroomId: string,
        username: string,
        password: string,
    ) => void
}

const HomepageContext = createContext<HomepageContextType | undefined>(
    undefined,
)

interface HomepageProviderProps {
    children: ReactNode
}

export const HomepageProvider: React.FC<HomepageProviderProps> = ({
    children,
}) => {
    const [hasInvalidPassword, setHadInvalidPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { wsMessages, setWsMessages, sendWebsocketMessageToServer } =
        useWebsocketContext()
    const { rooms, setRooms, getPassword } = useAuthContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (wsMessages.length > 0) {
            const lastMessage = wsMessages.pop()
            setWsMessages([...wsMessages])

            if (lastMessage) {
                handleMessageFromWebsocketServer(lastMessage)
            }
        }
    }, [wsMessages])

    const handleMessageFromWebsocketServer = (event: MessageEvent) => {
        try {
            const message: ServerMessage = JSON.parse(event.data)

            switch (message.activity) {
                case 'INVALID AUTHENTICATION':
                    setHadInvalidPassword(true)
                    break

                case 'ROOM CREATED':
                    const newRoom: Room = {
                        roomId: message.roomId,
                        password: message.password,
                    }
                    setRooms([...rooms, newRoom])
                    joinChatroom(
                        message.roomId,
                        message.username,
                        message.password,
                    )
                    console.log('Room created:', message)
                    break
                default:
                    console.log('Unknown message type:', message)
            }
        } catch (error) {
            console.error('Error processing WebSocket message', error)
        }
    }

    const createChatroom = async (name: string, username: string) => {
        const roomId = Math.random().toString(36).substr(2, 16)

        const chatMessage: ClientMessage = {
            activity: 'CREATE ROOM',
            roomId: roomId,
            username: username,
            timestamp: Date.now(),
            password: getPassword(roomId),
            message: 'User has created the chatroom',
        }
        setIsLoading(true)
        sendWebsocketMessageToServer(chatMessage)
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
        setIsLoading(true)
        sendWebsocketMessageToServer(chatMessage)
        navigate(`/chatroom/${roomId}`)
    }

    return (
        <HomepageContext.Provider
            value={{
                createChatroom,
                joinChatroom,
                setHadInvalidPassword,
                isLoading,
                hasInvalidPassword,
            }}
        >
            {children}
        </HomepageContext.Provider>
    )
}

export const useHomepageContext = (): HomepageContextType => {
    const context = useContext(HomepageContext)
    if (!context) {
        throw new Error(
            'useHomepageContext must be used within a HomepageProvider',
        )
    }
    return context
}

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendCreateRoomRequest } from '../Services/ChatroomService'

type RoomCreateResponse = {
    id: number
    name: string
    owner: string
    createdAt: Date
}

interface HomepageContextType {
    isLoading: boolean
    hasInvalidPassword: boolean
    setHadInvalidPassword: (hasInvalidPassword: boolean) => void
    createChatroom: (name: string, username: string) => void
}

const HomepageContext = createContext<HomepageContextType | undefined>(
    undefined,
)

interface HomepageProviderProps {
    children: ReactNode
}

const generatePassword = (): string => {
    return Math.random().toString(36).slice(2)
}

export const HomepageProvider: React.FC<HomepageProviderProps> = ({
    children,
}) => {
    const [hasInvalidPassword, setHadInvalidPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const createChatroom = async (name: string) => {
        const password = generatePassword()
        try {
            setIsLoading(true)
            const newRoom: RoomCreateResponse = await sendCreateRoomRequest(
                name,
                password,
            )
            navigate(`/chatroom/${newRoom.id}`)
        } catch (error) {
            console.error('Error creating chatroom:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <HomepageContext.Provider
            value={{
                createChatroom,
                isLoading,
                setHadInvalidPassword,
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

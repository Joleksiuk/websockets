import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ChatroomContextType {
    chatroomId: string
    chatroomName: string
    setChatroomName: (name: string) => void
    createChatroom: (name: string) => void
    joinChatroom: (id: string) => void
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

    const generateChatroomId = () => {
        const id = Math.random().toString(36).substr(2, 16)
        setChatroomId(id)
    }

    const createChatroom = (name: string) => {
        setChatroomName(name)
        generateChatroomId()
        joinChatroom(chatroomId)
    }

    const joinChatroom = (id: string) => {
        //TODO: connect to chatroom
    }

    return (
        <ChatroomContext.Provider
            value={{
                chatroomName,
                setChatroomName,
                chatroomId,
                createChatroom,
                joinChatroom,
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

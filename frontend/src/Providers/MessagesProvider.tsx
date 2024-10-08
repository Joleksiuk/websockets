import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ChatMessage = {
    id: number
    sender: string
    content: string
}

interface ChatContextType {
    messages: ChatMessage[]
    addMessage: (message: ChatMessage) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
    children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const addMessage = (message: ChatMessage) => {
        setMessages((prevMessages) => [...prevMessages, message])
    }

    return (
        <ChatContext.Provider value={{ messages, addMessage }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = (): ChatContextType => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeType } from '../Colors'

interface ModeContextType {
    mode: ThemeType
    setMode: (mode: ThemeType) => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

interface ChatProviderProps {
    children: ReactNode
}

export const ModeProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeType>('light')

    return (
        <ModeContext.Provider value={{ mode, setMode }}>
            {children}
        </ModeContext.Provider>
    )
}

export const useModeContext = (): ModeContextType => {
    const context = useContext(ModeContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}

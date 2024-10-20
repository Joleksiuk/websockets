import React from 'react'
import { ChatroomProvider } from '../Providers/ChatroomProvider'
import StartPage from './StartPage'

export default function HomePage() {
    return (
        <ChatroomProvider>
            <StartPage />
        </ChatroomProvider>
    )
}

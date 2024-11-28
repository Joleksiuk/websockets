import ChatroomPage from './Pages/ChatroomPage'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import { BasePageStyled } from './AppBase.styled'
import { useModeContext } from './Providers/ModeProvider'
import ErrorPage from './Pages/ErrorPage'
import Navbar from './Components/Navbar/Navbar'
import { ChatroomProvider } from './Providers/ChatroomProvider'
import AuthPage from './Pages/AuthPage'
import { useAuthContext } from './Providers/AuthProvider'
import { useWebsocketContext } from './Providers/WebsocketProvider'
import ReconnectPage from './Components/Reconnect/ReconnectPage'
import { LinearProgress } from '@mui/material'

export default function AppBase() {
    const { mode } = useModeContext()
    const { user, isAuthenticating } = useAuthContext()
    const { isDisconnected } = useWebsocketContext()

    if (isAuthenticating) {
        return (
            <BasePageStyled mode={mode}>
                <LinearProgress color="inherit" />
            </BasePageStyled>
        )
    }

    // if (isDisconnected) {
    //     return <ReconnectPage />
    // }

    if (!user) {
        return (
            <BasePageStyled mode={mode}>
                <AuthPage />
            </BasePageStyled>
        )
    }

    return (
        <BasePageStyled mode={mode}>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/chatroom/:chatroomId"
                    element={
                        <ChatroomProvider>
                            <ChatroomPage />
                        </ChatroomProvider>
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BasePageStyled>
    )
}

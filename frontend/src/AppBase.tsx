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
import { LinearProgress } from '@mui/material'
import { UsersProvider } from './Providers/UserProvider'

export default function AppBase() {
    const { mode } = useModeContext()
    const { user, isAuthenticating } = useAuthContext()

    if (isAuthenticating) {
        return (
            <BasePageStyled mode={mode}>
                <LinearProgress color="inherit" />
            </BasePageStyled>
        )
    }

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
                        <UsersProvider>
                            <ChatroomProvider>
                                <ChatroomPage />
                            </ChatroomProvider>
                        </UsersProvider>
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </BasePageStyled>
    )
}

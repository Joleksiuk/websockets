import ChatroomPage from './Pages/ChatroomPage'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import { BasePageStyled } from './AppBase.styled'
import { useModeContext } from './Providers/ModeProvider'
import ErrorPage from './Pages/ErrorPage'
import Navbar from './Components/Navbar/Navbar'
import { ChatroomProvider } from './Providers/ChatroomProvider'

export default function AppBase() {
    const { mode } = useModeContext()
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

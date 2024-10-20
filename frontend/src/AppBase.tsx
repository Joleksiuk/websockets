import ChatroomPage from './Pages/ChatroomPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'

export default function AppBase() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="/chatroom/:chatroomId"
                    element={<ChatroomPage />}
                />
            </Routes>
        </BrowserRouter>
    )
}

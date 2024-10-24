import ChatBase from '../Components/Chat/ChatBase'
import { useAuthContext } from '../Providers/AuthProvider'
import AuthPage from './AuthPage'

export default function ChatroomPage() {
    const { user } = useAuthContext()

    if (!user) {
        return <AuthPage />
    }

    return <ChatBase />
}

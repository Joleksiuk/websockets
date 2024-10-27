import { LinearProgress } from '@mui/material'
import ChatBase from '../Components/Chat/ChatBase'
import { useAuthContext } from '../Providers/AuthProvider'
import { useChatroomContext } from '../Providers/ChatroomProvider'
import AuthPage from './AuthPage'

export default function ChatroomPage() {
    const { user } = useAuthContext()
    const { isLoading } = useChatroomContext()

    if (!user) {
        return <AuthPage />
    }

    if (isLoading) {
        return <LinearProgress color="inherit" />
    }

    return <ChatBase />
}

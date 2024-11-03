import { LinearProgress } from '@mui/material'
import ChatBase from '../Components/Chat/ChatBase'
import { useChatroomContext } from '../Providers/ChatroomProvider'

export default function ChatroomPage() {
    const { isLoading } = useChatroomContext()

    if (isLoading) {
        return <LinearProgress color="inherit" />
    }

    return <ChatBase />
}

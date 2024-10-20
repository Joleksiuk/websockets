import ChatBase from '../Components/Chat/ChatBase'
import { ChatroomProvider } from '../Providers/ChatroomProvider'

export default function ChatroomPage() {
    return (
        <ChatroomProvider>
            <ChatBase />
        </ChatroomProvider>
    )
}

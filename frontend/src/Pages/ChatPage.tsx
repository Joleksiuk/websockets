import ChatBase from '../Components/Chat/ChatBase'
import { ChatroomProvider } from '../Providers/ChatroomProvider'

export default function ChatPage() {
    return (
        <ChatroomProvider>
            <ChatBase />
        </ChatroomProvider>
    )
}

import Avatar from '../Components/Avatar/Avatar'
import { useAuthContext } from '../Providers/AuthProvider'
import { useChatroomContext } from '../Providers/ChatroomProvider'
import { useModeContext } from '../Providers/ModeProvider'
import {
    MessageContainerStyled,
    MessageStyled,
    MessagesWrapperStyled,
} from './Message.styled'

export default function MessageList(): JSX.Element {
    const { messages } = useChatroomContext()
    const { mode } = useModeContext()
    const { user } = useAuthContext()

    return (
        <MessagesWrapperStyled>
            {messages.map((msg, index) => (
                <MessageContainerStyled isRight={msg.username === user}>
                    <Avatar key={`avatar-${index}`} username={msg.username} />
                    <MessageStyled
                        key={`message-${index}`}
                        isRight={msg.username === user}
                        mode={mode}
                    >
                        {msg.message}
                    </MessageStyled>
                </MessageContainerStyled>
            ))}
        </MessagesWrapperStyled>
    )
}

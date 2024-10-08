import Avatar from '../Components/Avatar/Avatar'
import { useChatContext } from '../Providers/MessagesProvider'
import { MessageContainerStyled, MessageStyled } from './Message.styled'

export default function MessageList(): JSX.Element {
    const { messages } = useChatContext()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
                <MessageContainerStyled>
                    <Avatar />
                    <MessageStyled key={msg.id} isRight={msg.sender === 'John'}>
                        {msg.content}
                    </MessageStyled>
                </MessageContainerStyled>
            ))}
        </div>
    )
}

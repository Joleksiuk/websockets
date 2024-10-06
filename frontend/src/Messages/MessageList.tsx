import { useChatContext } from '../Service/MessagesProvider'
import { MessageStyled } from './Message.styled'

export default function MessageList(): JSX.Element {
    const { messages } = useChatContext()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
                <MessageStyled key={msg.id} isRight={msg.sender === 'John'}>
                    {msg.content}
                </MessageStyled>
            ))}
        </div>
    )
}

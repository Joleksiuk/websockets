import Avatar from '../Components/Avatar/Avatar'
import { useChatContext } from '../Providers/MessagesProvider'
import { useModeContext } from '../Providers/ModeProvider'
import { MessageContainerStyled, MessageStyled } from './Message.styled'

export default function MessageList(): JSX.Element {
    const { messages } = useChatContext()
    const { mode } = useModeContext()
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg) => (
                <MessageContainerStyled>
                    <Avatar />
                    <MessageStyled
                        key={msg.id}
                        isRight={msg.sender === 'John'}
                        mode={mode}
                    >
                        {msg.content}
                    </MessageStyled>
                </MessageContainerStyled>
            ))}
        </div>
    )
}

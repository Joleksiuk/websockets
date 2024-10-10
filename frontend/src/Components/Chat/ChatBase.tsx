import { useEffect, useRef } from 'react'
import { ChatStyled, Container, Square } from './ChatBase.styled'

import MessageList from '../../Messages/MessageList'
import ModeSwitch from '../../ModeSwitch/ModeSwitch'
import { useAuthContext } from '../../Providers/AuthProvider'
import { ChatProvider } from '../../Providers/MessagesProvider'
import TextInput from '../Inputs/TextInput'
import StartPage from '../../Pages/StartPage'
import { useModeContext } from '../../Providers/ModeProvider'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)

    const { mode } = useModeContext()
    const { user } = useAuthContext()

    useEffect(() => {
        if (squareRef.current) {
            squareRef.current.scrollTop = squareRef.current.scrollHeight
        }
    }, [])

    return (
        <Container mode={mode}>
            {user ? (
                <>
                    <ModeSwitch />
                    <ChatProvider>
                        <Square ref={squareRef} mode={mode}>
                            <ChatStyled mode={mode}>
                                <MessageList />
                            </ChatStyled>
                            <TextInput />
                        </Square>
                    </ChatProvider>
                </>
            ) : (
                <StartPage />
            )}
        </Container>
    )
}

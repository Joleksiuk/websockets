import { useEffect, useRef } from 'react'
import { ChatStyled, Container, Square } from './ChatBase.styled'

import MessageList from '../../Messages/MessageList'
import TextInput from '../Inputs/TextInput'
import { useModeContext } from '../../Providers/ModeProvider'
import UserList from '../UserList/UserList'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import ChatroomAuth from '../ChatroomAuth/ChatroomAuth'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const { isAuthenticated } = useChatroomContext()

    const { mode } = useModeContext()
    const { chatroomId } = useChatroomContext()

    useEffect(() => {
        if (squareRef.current) {
            squareRef.current.scrollTop = squareRef.current.scrollHeight
        }
    }, [])

    if (!isAuthenticated) {
        return (
            <Container mode={mode}>
                <ChatroomAuth />
            </Container>
        )
    }

    return (
        <Container mode={mode}>
            <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                Chatroom : {chatroomId}
            </Typography>
            <UserList />
            <Square ref={squareRef} mode={mode}>
                <ChatStyled mode={mode}>
                    <MessageList />
                </ChatStyled>
                <TextInput />
            </Square>
        </Container>
    )
}

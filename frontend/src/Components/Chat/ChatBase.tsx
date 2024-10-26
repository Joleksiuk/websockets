import { useEffect, useRef } from 'react'
import {
    ChatroomContentStyled,
    ChatStyled,
    Container,
    Square,
} from './ChatBase.styled'

import MessageList from '../../Messages/MessageList'
import TextInput from '../Inputs/TextInput'
import { useModeContext } from '../../Providers/ModeProvider'
import UserList from '../UserList/UserList'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import ChatroomAuth from '../ChatroomAuth/ChatroomAuth'
import { useParams } from 'react-router-dom'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const { isAuthenticated } = useChatroomContext()

    const { mode } = useModeContext()
    const { chatroomId } = useParams()

    useEffect(() => {
        if (squareRef.current) {
            squareRef.current.scrollTop = squareRef.current.scrollHeight
        }
    }, [])

    if (!isAuthenticated) {
        return (
            <Container mode={mode}>
                <ChatroomContentStyled>
                    <ChatroomAuth />
                </ChatroomContentStyled>
            </Container>
        )
    }

    return (
        <Container mode={mode}>
            <UserList />
            <ChatroomContentStyled>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    Chatroom : {chatroomId}
                </Typography>
                <Square ref={squareRef} mode={mode}>
                    <ChatStyled mode={mode}>
                        <MessageList />
                    </ChatStyled>
                    <TextInput />
                </Square>
            </ChatroomContentStyled>
        </Container>
    )
}

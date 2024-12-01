import { useRef } from 'react'
import {
    ChatroomContentStyled,
    ChatStyled,
    Container,
    NoPermissionContainer,
    Square,
} from './ChatBase.styled'

import MessageList from '../../Messages/MessageList'
import TextInput from '../Inputs/TextInput'
import { useModeContext } from '../../Providers/ModeProvider'
import UserList from '../UserList/UserList'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import LinearProgress from '@mui/material/LinearProgress'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const { isAuthenticated, isLoading, room } = useChatroomContext()
    const { mode } = useModeContext()

    if (isLoading) {
        return <LinearProgress />
    }

    if (!isAuthenticated) {
        return (
            <NoPermissionContainer>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    You do not have access to this chatroom. Please ask the
                    owner for permission.
                </Typography>
            </NoPermissionContainer>
        )
    }

    return (
        <Container mode={mode}>
            <UserList />
            <ChatroomContentStyled>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    Chatroom : {room?.name}
                </Typography>
                <Square ref={squareRef} mode={mode}>
                    <ChatStyled mode={mode}>
                        <MessageList key="message-list" />
                    </ChatStyled>
                    <TextInput />
                </Square>
            </ChatroomContentStyled>
        </Container>
    )
}

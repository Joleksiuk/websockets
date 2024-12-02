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
import { Button, Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import LinearProgress from '@mui/material/LinearProgress'
import { ClientMessage } from '../../Providers/Models'
import { useWebsocketContext } from '../../Providers/WebsocketProvider'
import { useAuthContext } from '../../Providers/AuthProvider'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const { isAuthenticated, isLoading, room } = useChatroomContext()
    const { mode } = useModeContext()
    const { user } = useAuthContext()
    const { sendWebsocketMessageToServer } = useWebsocketContext()
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
    const handleClickMe = () => {
        if (room) {
            const chatMessage: ClientMessage = {
                activity: 'JOIN ROOM',
                roomId: room.id,
                username: user?.username || 'Unknown',
                timestamp: Date.now(),
                message: 'User has joined the chatroom',
            }
            console.log('Sending join room message:', chatMessage)
            sendWebsocketMessageToServer(chatMessage)
        }
    }

    return (
        <Container mode={mode}>
            <UserList />
            <ChatroomContentStyled>
                <Button onClick={handleClickMe}>Click me</Button>
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

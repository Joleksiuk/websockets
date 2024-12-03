import { useRef, useState } from 'react'
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
import { useWebsocketContext } from '../../Providers/WebsocketProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import { ClientMessage } from '../../Providers/ws/WebsocketDataModels'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const [hasStarted, setHasStarted] = useState(false)
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
    const handleStartChatting = () => {
        if (room && user) {
            const clientMessage: ClientMessage = {
                eventName: 'USER JOINED ROOM',
                payload: {
                    roomId: room.id,
                    userId: user.userId,
                },
            }
            sendWebsocketMessageToServer(clientMessage)
            setHasStarted(true)
        }
    }

    return (
        <Container mode={mode}>
            <UserList />
            <ChatroomContentStyled>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    Chatroom : {room?.name}
                </Typography>
                {hasStarted ? (
                    <Square ref={squareRef} mode={mode}>
                        <ChatStyled mode={mode}>
                            <MessageList key="message-list" />
                        </ChatStyled>
                        <TextInput />
                    </Square>
                ) : (
                    <Square ref={squareRef} mode={mode}>
                        <Button
                            sx={{ width: '100%', height: '100%' }}
                            onClick={handleStartChatting}
                        >
                            Start chatting
                        </Button>
                    </Square>
                )}
            </ChatroomContentStyled>
        </Container>
    )
}

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
import ReconnectPage from '../Reconnect/ReconnectPage'

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const [hasStarted, setHasStarted] = useState(false)
    const { isAuthenticated, isLoading, room, joinChatroom } =
        useChatroomContext()
    const { mode } = useModeContext()

    const { isDisconnected, showReconnectPage } = useWebsocketContext()

    if (isLoading) {
        return <LinearProgress />
    }
    if (showReconnectPage || isDisconnected) {
        return <ReconnectPage />
    }

    if (!isAuthenticated) {
        return (
            <NoPermissionContainer>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    Nie masz dostępu do pokoju. Poproś właściciela o dostęp.
                </Typography>
            </NoPermissionContainer>
        )
    }
    const handleStartChatting = () => {
        joinChatroom()
        setHasStarted(true)
    }

    return (
        <Container mode={mode}>
            <UserList />
            <ChatroomContentStyled>
                <Typography variant="h5" color={getColorInMode('TEXT', mode)}>
                    Nazwa pokoju : {room?.name}
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

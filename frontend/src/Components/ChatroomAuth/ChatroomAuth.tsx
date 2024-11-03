import { Alert, Button, TextField, ThemeProvider } from '@mui/material'
import { ChatroomAuthStyled } from './ChatroomAuth.styled'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../Providers/AuthProvider'
import { theme } from '../../Pages/StartPage.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useState } from 'react'
import { useChatroomContext } from '../../Providers/ChatroomProvider'

export default function ChatroomAuth() {
    const [currentPassword, setCurrentPassword] = useState('')
    const { chatroomId } = useParams()
    const { user } = useAuthContext()
    const { mode } = useModeContext()
    const { joinChatroom, hasInvalidPassword } = useChatroomContext()
    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCurrentPassword(event.target.value)
    }

    const handleSubmit = () => {
        if (chatroomId && user) {
            joinChatroom(chatroomId, user.username, currentPassword)
        }
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <ChatroomAuthStyled>
                {hasInvalidPassword && (
                    <Alert variant="filled" severity="error">
                        Wrong password provided
                    </Alert>
                )}
                <TextField
                    id="outlined-basic"
                    label="Chatroom Password"
                    variant="outlined"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    type="password"
                />
                <Button variant="outlined" onClick={handleSubmit}>
                    Submit
                </Button>
            </ChatroomAuthStyled>
        </ThemeProvider>
    )
}

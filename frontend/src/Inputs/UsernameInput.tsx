import { Button, TextField, ThemeProvider, Typography } from '@mui/material'
import React from 'react'
import { useAuthContext } from '../Service/AuthProvider'
import { CURRENT_THEME } from '../Colors'
import {
    ContainerStyled,
    HorizontalContainerStyled,
    theme,
    VerticalContainerStyled,
} from './UsernameInput.styled'
import Divider from '@mui/material/Divider'
import { useChatroomContext } from '../Chatroom/ChatroomProvider'

export default function UsernameInput() {
    const [username, setUsername] = React.useState('')
    const [chatroomName, setChatroomName] = React.useState('')
    const [chatroomId, setChatroomId] = React.useState('')
    const { login } = useAuthContext()

    const { joinChatroom, createChatroom } = useChatroomContext()

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
    }

    const handleChatroomChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChatroomName(event.target.value)
    }

    const handleChatroomIdChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChatroomId(event.target.value)
    }

    const handleJoinChatroom = () => {
        if (username.trim() !== '' && chatroomId.trim() !== '') {
            joinChatroom(chatroomId)
            login(username)
        }
    }

    const handleCreateChatroom = () => {
        if (username.trim() !== '' && chatroomName.trim() !== '') {
            createChatroom(chatroomName)
            login(username)
        }
    }

    return (
        <ThemeProvider theme={theme(CURRENT_THEME)}>
            <VerticalContainerStyled mode={CURRENT_THEME}>
                <Typography variant="h3">Choose your username</Typography>

                <TextField
                    id="outlined-basic"
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    sx={{ width: '40%' }}
                />
                <br></br>
                <br></br>

                <HorizontalContainerStyled>
                    <ContainerStyled>
                        <Typography variant="h3">Join room</Typography>

                        <TextField
                            id="outlined-basic"
                            label="Chatroom ID"
                            variant="outlined"
                            value={chatroomId}
                            onChange={handleChatroomIdChange}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                width: '70%',
                            }}
                            onClick={handleJoinChatroom}
                        >
                            JOIN
                        </Button>
                    </ContainerStyled>

                    <Divider orientation="vertical" flexItem />
                    <ContainerStyled>
                        <Typography variant="h3">Create room</Typography>

                        <TextField
                            id="outlined-basic"
                            label="Chatroom name"
                            variant="outlined"
                            value={chatroomName}
                            onChange={handleChatroomChange}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                width: '70%',
                            }}
                            onClick={handleCreateChatroom}
                        >
                            CREATE
                        </Button>
                    </ContainerStyled>
                </HorizontalContainerStyled>
            </VerticalContainerStyled>
        </ThemeProvider>
    )
}

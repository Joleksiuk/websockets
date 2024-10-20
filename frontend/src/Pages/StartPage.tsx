import { Button, TextField, ThemeProvider, Typography } from '@mui/material'
import React from 'react'

import Divider from '@mui/material/Divider'
import { useChatroomContext } from '../Providers/ChatroomProvider'
import { useAuthContext } from '../Providers/AuthProvider'
import {
    VerticalContainerStyled,
    HorizontalContainerStyled,
    ContainerStyled,
    theme,
} from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'
import ModeSwitch from '../ModeSwitch/ModeSwitch'
import { getColorInMode } from '../Colors'
import { useNavigate } from 'react-router-dom'

export default function StartPage() {
    const [username, setUsername] = React.useState('')
    const [chatroomName, setChatroomName] = React.useState('')
    const [chatroomId, setChatroomId] = React.useState('')
    const { login } = useAuthContext()
    const { mode } = useModeContext()
    const navigate = useNavigate()

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
            joinChatroom(chatroomId, username)
            login(username)
            navigate(`/chatroom/${chatroomId}`)
        }
    }

    const handleCreateChatroom = async () => {
        if (username.trim() !== '' && chatroomName.trim() !== '') {
            createChatroom(chatroomName, username)
            login(username)
        }
    }
    return (
        <ThemeProvider theme={theme(mode)}>
            <VerticalContainerStyled mode={mode}>
                <ModeSwitch />
                <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                    Choose your username
                </Typography>
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
                        <Typography
                            color={getColorInMode('TEXT', mode)}
                            variant="h3"
                        >
                            Join room
                        </Typography>

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
                        <Typography
                            color={getColorInMode('TEXT', mode)}
                            variant="h3"
                        >
                            Create room
                        </Typography>

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

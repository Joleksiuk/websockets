import { Typography, TextField, Button, Divider } from '@mui/material'
import React from 'react'
import { getColorInMode } from '../Colors'
import { HorizontalContainerStyled, ContainerStyled } from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'
import { useNavigate } from 'react-router-dom'
import { useChatroomContext } from '../Providers/ChatroomProvider'
import { useAuthContext } from '../Providers/AuthProvider'

export default function RoomChoicePage() {
    const { mode } = useModeContext()

    const { user } = useAuthContext()
    const [chatroomName, setChatroomName] = React.useState('')
    const [chatroomId, setChatroomId] = React.useState('')
    const [password, setPassword] = React.useState('')

    const { joinChatroom, createChatroom } = useChatroomContext()

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
        if (user && chatroomId.trim() !== '' && password.trim() !== '') {
            joinChatroom(chatroomId, user)
        }
    }

    const handleCreateChatroom = async () => {
        if (user && chatroomName.trim() !== '') {
            createChatroom(chatroomName, user)
        }
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value)
    }

    return (
        <HorizontalContainerStyled>
            <ContainerStyled>
                <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                    Join room
                </Typography>

                <TextField
                    id="outlined-basic"
                    label="Chatroom ID"
                    variant="outlined"
                    value={chatroomId}
                    onChange={handleChatroomIdChange}
                />
                <TextField
                    id="outlined-basic"
                    label="Chatroom Password"
                    variant="outlined"
                    value={password}
                    onChange={handlePasswordChange}
                    type="password"
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
                <Typography color={getColorInMode('TEXT', mode)} variant="h3">
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
    )
}

import {
    Typography,
    TextField,
    Button,
    Divider,
    LinearProgress,
} from '@mui/material'
import React from 'react'
import { getColorInMode } from '../Colors'
import { HorizontalContainerStyled, ContainerStyled } from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'
import { useAuthContext } from '../Providers/AuthProvider'
import { useHomepageContext } from './HomePageProvider'
import { useNavigate } from 'react-router-dom'

export default function RoomChoicePage() {
    const { mode } = useModeContext()
    const { user } = useAuthContext()
    const [chatroomName, setChatroomName] = React.useState('')
    const [chatroomId, setChatroomId] = React.useState('')
    const {
        createChatroom,
        setHadInvalidPassword,
        isLoading,
        hasInvalidPassword,
    } = useHomepageContext()

    const navigate = useNavigate()

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
        if (user && chatroomId.trim() !== '') {
            navigate(`/chatroom/${chatroomId}`)
        }
    }

    const handleCreateChatroom = async () => {
        if (user && chatroomName.trim() !== '') {
            createChatroom(chatroomName, user.username)
        }
    }

    if (isLoading) {
        return <LinearProgress color="inherit" />
    }

    if (hasInvalidPassword) {
        return (
            <ContainerStyled>
                <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                    Invalid Password
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => setHadInvalidPassword(false)}
                >
                    Try again
                </Button>
            </ContainerStyled>
        )
    }

    return (
        <HorizontalContainerStyled>
            <ContainerStyled>
                <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                    Join room
                </Typography>

                <TextField
                    label="Chatroom ID"
                    variant="outlined"
                    value={chatroomId}
                    onChange={handleChatroomIdChange}
                    autoComplete="off"
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

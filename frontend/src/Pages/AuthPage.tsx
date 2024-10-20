import { Typography, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { getColorInMode } from '../Colors'
import ModeSwitch from '../ModeSwitch/ModeSwitch'
import { useAuthContext } from '../Providers/AuthProvider'
import { useModeContext } from '../Providers/ModeProvider'
import { theme, VerticalContainerStyled } from './StartPage.styled'

export default function AuthPage() {
    const [username, setUsername] = useState('')
    const { login } = useAuthContext()
    const { mode } = useModeContext()
    const navigate = useNavigate()

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
    }

    const handleLogin = () => {
        if (username.trim() !== '') {
            login(username)
            navigate(`/chatroom`)
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
                <Button onClick={handleLogin}></Button>
            </VerticalContainerStyled>
        </ThemeProvider>
    )
}

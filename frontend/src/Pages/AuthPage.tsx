import { Typography, TextField } from '@mui/material'
import { useState } from 'react'
import { getColorInMode } from '../Colors'
import { useAuthContext } from '../Providers/AuthProvider'
import { useModeContext } from '../Providers/ModeProvider'
import { VerticalContainerStyled } from './StartPage.styled'

export default function AuthPage() {
    const [username, setUsername] = useState('')
    const { login } = useAuthContext()
    const { mode } = useModeContext()

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
    }

    const handleLogin = () => {
        if (username.trim() !== '') {
            login(username)
        }
    }

    return (
        <VerticalContainerStyled mode={mode}>
            <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                Please enter your username
            </Typography>
            <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                sx={{ width: '25%' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleLogin()
                    }
                }}
            />
        </VerticalContainerStyled>
    )
}

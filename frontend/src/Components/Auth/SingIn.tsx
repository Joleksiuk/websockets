import { Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { getColorInMode } from '../../Colors'
import { SingInWrapper } from './SignIn.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import { sendLoginRequest } from '../../Services/AuthService'

export type Error = {
    message: string
    status: number
}
export default function SingIn() {
    const { mode } = useModeContext()
    const { login } = useAuthContext()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { setCurrentPage } = useAuthContext()
    const handleSignIn = async () => {
        try {
            if (username.trim() !== '' || password.trim() !== '') {
                await sendLoginRequest(username, password)
                login(username)
            }
        } catch (e: unknown) {
            const error = e as Error
            console.error(error.message)
            return
        }
    }

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value)
    }

    const handlePressSignUp = () => {
        setCurrentPage('signup')
    }

    return (
        <SingInWrapper>
            <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                Sign In
            </Typography>
            <TextField
                placeholder="Enter username"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                sx={{ width: '25%' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSignIn()
                    }
                }}
            />
            <TextField
                placeholder="Enter password"
                variant="outlined"
                value={password}
                sx={{ width: '25%' }}
                onChange={handlePasswordChange}
                type="password"
            />
            <Button
                variant="outlined"
                sx={{ width: '25%' }}
                onClick={handleSignIn}
            >
                Submit
            </Button>
            <Typography color={getColorInMode('TEXT', mode)} variant="h5">
                Don't have an account?
            </Typography>
            <Button
                variant="outlined"
                sx={{ width: '25%' }}
                onClick={handlePressSignUp}
            >
                Sign Up
            </Button>
        </SingInWrapper>
    )
}
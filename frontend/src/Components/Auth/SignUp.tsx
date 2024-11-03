import { Typography, TextField, Button } from '@mui/material'
import React, { useState } from 'react'
import { getColorInMode } from '../../Colors'
import { SingInWrapper } from './SignIn.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import { sendRegisterRequest } from '../../Services/AuthService'

export default function SignUp() {
    const { mode } = useModeContext()
    const { setCurrentPage } = useAuthContext()

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value)
    }

    const handleSignUp = async () => {
        try {
            if (username.trim() !== '' || password.trim() !== '') {
                await sendRegisterRequest(username, password)
                setCurrentPage('signin')
            }
        } catch (e: unknown) {
            const error = e as Error
            console.error(error.message)
            return
        }
    }

    const handlePressSignIn = () => {
        setCurrentPage('signin')
    }

    return (
        <SingInWrapper>
            <Typography color={getColorInMode('TEXT', mode)} variant="h3">
                Sign Up
            </Typography>
            <TextField
                variant="outlined"
                placeholder="Enter username"
                autoComplete="off"
                value={username}
                onChange={handleUsernameChange}
                sx={{ width: '25%' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSignUp()
                    }
                }}
            />
            <TextField
                variant="outlined"
                placeholder="Enter email"
                autoComplete="off"
                value={email}
                sx={{ width: '25%' }}
                onChange={handleEmailChange}
                type="email"
            />
            <TextField
                placeholder="Enter password"
                autoComplete="off"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                sx={{ width: '25%' }}
                type="password"
            />
            <Button
                variant="outlined"
                sx={{ width: '25%' }}
                onClick={handleSignUp}
            >
                Submit
            </Button>
            <Typography
                sx={{ paddingTop: '50px' }}
                color={getColorInMode('TEXT', mode)}
                variant="h5"
            >
                Already have an account? Sing in.
            </Typography>
            <Button
                variant="outlined"
                sx={{ width: '25%' }}
                onClick={handlePressSignIn}
            >
                Sign Up
            </Button>
        </SingInWrapper>
    )
}

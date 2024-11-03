import { Typography, TextField, Button, Alert } from '@mui/material'
import React, { useState } from 'react'
import { getColorInMode } from '../../Colors'
import { SingInWrapper } from './SignIn.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import { sendRegisterRequest } from '../../Services/AuthService'
import ValidationService, { CustomValidationError } from './ValidationService'

export default function SignUp() {
    const { mode } = useModeContext()
    const { setCurrentPage } = useAuthContext()

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<CustomValidationError | null>(null)

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setError(null)
        setUsername(event.target.value)
    }

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setEmail(event.target.value)
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setError(null)
        setPassword(event.target.value)
    }

    const validateInputs = () => {
        try {
            ValidationService.validateUsername(username)
            ValidationService.validatePassword(password)
            ValidationService.validateEmail(email)
        } catch (e: unknown) {
            if (e instanceof CustomValidationError) {
                setError(e)
            }
        }
    }

    const handleSignUp = async () => {
        validateInputs()

        try {
            await sendRegisterRequest(username, password)
            setCurrentPage('signin')
        } catch (e: unknown) {
            console.error(e)
        }
    }

    const handlePressSignIn = () => {
        setCurrentPage('signin')
    }

    return (
        <SingInWrapper>
            {error && <Alert severity="error">{error.message}</Alert>}
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
                error={error?.element === 'username'}
            />
            <TextField
                variant="outlined"
                placeholder="Enter email"
                autoComplete="off"
                value={email}
                sx={{ width: '25%' }}
                onChange={handleEmailChange}
                type="email"
                error={error?.element === 'email'}
            />
            <TextField
                placeholder="Enter password"
                autoComplete="off"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                sx={{ width: '25%' }}
                type="password"
                error={error?.element === 'password'}
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

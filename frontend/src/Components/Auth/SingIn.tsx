import { Alert, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { getColorInMode } from '../../Colors'
import { SingInWrapper } from './SignIn.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import ValidationService, { CustomValidationError } from './ValidationService'

export type Error = {
    message: string
    status: number
}

export type AuthForm = 'username' | 'password' | 'email'

export type ValidationError = {
    message: string
    element: AuthForm
}

export default function SingIn() {
    const { mode } = useModeContext()
    const { login, setCurrentPage } = useAuthContext()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<CustomValidationError | null>(null)

    const handleSignIn = async () => {
        try {
            validateInputs()
            await login(username, password)
        } catch (e: unknown) {
            if (e instanceof CustomValidationError) {
                const error = e as CustomValidationError
                setError(error)
                return
            } else {
                console.error(e)
            }
        }
    }

    const validateInputs = () => {
        ValidationService.validateUsername(username)
        ValidationService.validatePassword(password)
    }

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setError(null)
        setUsername(event.target.value)
    }

    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setError(null)
        setPassword(event.target.value)
    }

    const handlePressSignUp = () => {
        setCurrentPage('signup')
    }

    return (
        <SingInWrapper>
            {error && <Alert severity="error">{error.message}</Alert>}
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
                error={error?.element === 'username'}
            />
            <TextField
                placeholder="Enter password"
                variant="outlined"
                value={password}
                sx={{ width: '25%' }}
                onChange={handlePasswordChange}
                type="password"
                error={error?.element === 'password'}
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

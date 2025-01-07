import { Alert, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { getColorInMode } from '../../Colors'
import { SingInWrapper } from './SignIn.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import ValidationService, { CustomValidationError } from './ValidationService'
import { useSnackbar } from '../SnackBars'

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
    const { addMessage } = useSnackbar()

    const handleSignIn = async () => {
        try {
            validateInputs()
            const response = await login(username, password)

            console.log('Response:', response)
            if (response.status === 429) {
                addMessage(
                    'Zbyt wiele prób logowania spróbuj ponownie za 15 minut',
                    'error',
                )
            }

            if (response.status === 401) {
                addMessage('Niepoprawne dane logowania', 'error')
            }
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
                Logowanie
            </Typography>
            <TextField
                placeholder="Wprowadź nazwę użytkownika"
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
                placeholder="Wprowadź hasło"
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
                Potwierdź
            </Button>
            <Typography color={getColorInMode('TEXT', mode)} variant="h5">
                Nie masz konta?
            </Typography>
            <Button
                variant="outlined"
                sx={{ width: '25%' }}
                onClick={handlePressSignUp}
            >
                Przejdź do rejestracji
            </Button>
        </SingInWrapper>
    )
}

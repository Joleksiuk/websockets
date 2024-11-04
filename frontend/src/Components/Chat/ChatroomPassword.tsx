import { VisibilityOff, Visibility } from '@mui/icons-material'
import {
    OutlinedInput,
    InputAdornment,
    IconButton,
    ThemeProvider,
} from '@mui/material'
import React from 'react'
import { theme } from '../../Pages/StartPage.styled'
import { useModeContext } from '../../Providers/ModeProvider'

type Props = {
    password: string
}

export default function ChatroomPassword({ password }: Props): JSX.Element {
    const [showPassword, setShowPassword] = React.useState(false)
    const { mode } = useModeContext()
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }

    const handleMouseUpPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <OutlinedInput
                value={password}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword
                                    ? 'hide the password'
                                    : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </ThemeProvider>
    )
}

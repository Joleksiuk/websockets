import React, { useState } from 'react'
import TextField from '@mui/material/TextField'

import {
    createTheme,
    FilledInput,
    IconButton,
    Input,
    InputAdornment,
    PaletteMode,
    ThemeProvider,
} from '@mui/material'
import { CURRENT_THEME, getColor, getColorInMode, ThemeType } from '../Colors'
import SendIcon from '@mui/icons-material/Send'

export const theme = (mode: ThemeType) =>
    createTheme({
        palette: {
            mode: mode as PaletteMode,
        },
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: getColorInMode(
                            'TEXT_INPUT_BACKGROUND',
                            mode,
                        ),

                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'TEXT_INPUT_BORDER',
                                mode,
                            ),
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'TEXT_INPUT_BORDER_HOVER',
                                mode,
                            ),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'TEXT_INPUT_BORDER_FOCUS',
                                mode,
                            ),
                        },
                        '&.Mui-focused': {
                            backgroundColor: getColorInMode(
                                'TEXT_INPUT_BACKGROUND_FOCUS',
                                mode,
                            ),
                        },
                    },
                    input: {
                        color: getColorInMode('TEXT', mode),
                    },
                },
            },
        },
    })
export default function TextInput() {
    const [text, setText] = useState('')

    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => setShowPassword((show) => !show)

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
        <ThemeProvider theme={theme(CURRENT_THEME)}>
            <FilledInput
                value={text}
                onChange={(text) => setText(text.target.value)}
                defaultValue="Write you message here"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </ThemeProvider>
    )
}

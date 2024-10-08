import { createTheme, PaletteMode } from '@mui/material'
import { ThemeType, getColorInMode } from '../../Colors'

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

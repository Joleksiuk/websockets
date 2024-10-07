import { createTheme } from '@mui/material'
import { getColorInMode, ThemeType } from './Colors'

export const theme = (mode: ThemeType) =>
    createTheme({
        palette: {
            primary: {
                main: getColorInMode('CHAT_BACKGROUND', mode),
            },
            text: {
                primary: getColorInMode('TEXT', mode),
            },
        },

        typography: {
            h3: {
                color: getColorInMode('TEXT', mode),
            },
        },
    })

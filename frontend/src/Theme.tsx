import { createTheme } from '@mui/material'
import { getColor } from './Colors'

export const theme = createTheme({
    palette: {
        primary: {
            main: getColor('CHAT_BACKGROUND'),
        },
        text: {
            primary: getColor('TEXT'),
        },
    },
})

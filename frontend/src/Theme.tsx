import { createTheme } from '@mui/material'
import { ThemeType } from './Colors'

export const DefaultTheme = (mode: ThemeType) =>
    createTheme({
        palette: {
            mode: mode,
        },
    })

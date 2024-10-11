import { createTheme } from '@mui/material'
import { ThemeType } from './Colors'

export const DefaultTheme = (mode: ThemeType) => {
    return createTheme({
        palette: {
            mode: mode,
        },
    })
}

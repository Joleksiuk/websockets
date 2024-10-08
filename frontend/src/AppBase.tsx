import { ThemeProvider } from 'styled-components'
import ChatPage from './Pages/ChatPage'
import { AuthProvider } from './Providers/AuthProvider'
import { DefaultTheme } from './Theme'
import { useModeContext } from './Providers/ModeProvider'
import { CssBaseline } from '@mui/material'

export default function AppBase() {
    const { mode } = useModeContext()
    return (
        <ThemeProvider theme={DefaultTheme(mode)}>
            <CssBaseline />
            <AuthProvider>
                <ChatPage />
            </AuthProvider>
        </ThemeProvider>
    )
}

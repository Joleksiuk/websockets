import { ThemeProvider } from '@mui/material'
import { useAuthContext } from '../Providers/AuthProvider'
import AuthPage from './AuthPage'
import RoomChoicePage from './RoomChoicePage'
import { theme } from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'

export default function StartPage() {
    const { user } = useAuthContext()
    const { mode } = useModeContext()
    return (
        <ThemeProvider theme={theme(mode)}>
            {user ? <RoomChoicePage /> : <AuthPage />}
        </ThemeProvider>
    )
}

import SingIn from '../Components/Auth/SingIn'
import SignUp from '../Components/Auth/SignUp'
import { useAuthContext } from '../Providers/AuthProvider'
import { ThemeProvider } from '@mui/material'
import { theme } from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'
import Navbar from '../Components/Navbar/Navbar'

export default function AuthPage() {
    const { currentPage } = useAuthContext()
    const { mode } = useModeContext()
    const getContent = () => {
        if (currentPage === 'signin') {
            return <SingIn />
        }
        return <SignUp />
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <Navbar />
            {getContent()}
        </ThemeProvider>
    )
}

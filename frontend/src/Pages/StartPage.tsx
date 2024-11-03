import { ThemeProvider } from '@mui/material'
import RoomChoicePage from './RoomChoicePage'
import { theme } from './StartPage.styled'
import { useModeContext } from '../Providers/ModeProvider'

export default function StartPage() {
    const { mode } = useModeContext()
    return (
        <ThemeProvider theme={theme(mode)}>
            <RoomChoicePage />
        </ThemeProvider>
    )
}

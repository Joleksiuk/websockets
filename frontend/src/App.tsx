import './App.css'
import { ModeContext, ModeProvider } from './Providers/ModeProvider'
import AppBase from './AppBase'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from 'styled-components'
import { AuthProvider } from './Providers/AuthProvider'
import { DefaultTheme } from './Theme'
import { WebsocketProvider } from './Providers/WebsocketProvider'

function App() {
    return (
        <WebsocketProvider>
            <ModeProvider>
                <ModeContext.Consumer>
                    {({ mode }) => (
                        <ThemeProvider theme={DefaultTheme(mode)}>
                            <CssBaseline />
                            <AuthProvider>
                                <AppBase />
                            </AuthProvider>
                        </ThemeProvider>
                    )}
                </ModeContext.Consumer>
            </ModeProvider>
        </WebsocketProvider>
    )
}

export default App

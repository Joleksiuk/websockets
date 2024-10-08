import './App.css'
import { ModeProvider } from './Providers/ModeProvider'
import AppBase from './AppBase'

function App() {
    return (
        <ModeProvider>
            <AppBase />
        </ModeProvider>
    )
}

export default App

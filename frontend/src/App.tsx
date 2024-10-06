import './App.css'
import AppBase from './Chat/AppBase'
import { AuthProvider } from './Service/AuthProvider'

function App() {
    return (
        <AuthProvider>
            <AppBase />
        </AuthProvider>
    )
}

export default App

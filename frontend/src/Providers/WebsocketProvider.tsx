import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ClientMessage } from './Models'

interface WebsocketContextType {
    ws: WebSocket | null
    isConnected: boolean
    sendWebsocketMessageToServer: (message: ClientMessage) => void
}

export const WebsocketContext = createContext<WebsocketContextType>({
    ws: null,
    isConnected: false,
    sendWebsocketMessageToServer: (message: ClientMessage) => undefined,
})

interface WebsocketProviderProps {
    children: ReactNode
}

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({
    children,
}) => {
    const [ws, setWs] = useState<WebSocket>(
        new WebSocket('ws://localhost:8080'),
    )
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket connection already open')
            return
        }
        console.log(ws)
        console.log('Connecting to WebSocket server...')

        const socket = new WebSocket('ws://localhost:8080')

        socket.onopen = () => {
            console.log('Successfuly Connected to WebSocket server!')
            setIsConnected(true)
        }

        socket.onclose = () => {
            console.log('WebSocket connection closed')
            setIsConnected(false)
        }

        setWs(socket)
        return () => {
            socket.close()
        }
    }, [])

    const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    const sendWebsocketMessageToServer = async (message: ClientMessage) => {
        let messageSent = false
        let currentAttempts = 0
        const maxAttempts = 2
        while (!messageSent && currentAttempts < maxAttempts) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message))
                messageSent = true
            } else {
                console.log('Connection is not open')
                currentAttempts++
                await sleep(1000)
            }
        }
    }

    return (
        <WebsocketContext.Provider
            value={{ ws, isConnected, sendWebsocketMessageToServer }}
        >
            {children}
        </WebsocketContext.Provider>
    )
}

export const useWebsocketContext = (): WebsocketContextType => {
    const context = useContext(WebsocketContext)
    if (!context) {
        throw new Error('useWebsocket must be used within a  WebsocketProvider')
    }
    return context
}

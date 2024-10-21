import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'

interface WebsocketContextType {
    ws: WebSocket
    isConnected: boolean
}

export const WebsocketContext = createContext<WebsocketContextType>({
    ws: new WebSocket('ws://localhost:8080'),
    isConnected: false,
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

    return (
        <WebsocketContext.Provider value={{ ws, isConnected }}>
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

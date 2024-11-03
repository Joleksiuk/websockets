import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ClientMessage } from './Models'

const HEARTBEAT_TIMEOUT = 1000 * 5 + 1000 * 1
const HEARTBEAT_VALUE = 1

interface WebsocketContextType {
    ws: WebSocket | null
    isConnected: boolean
    sendWebsocketMessageToServer: (message: ClientMessage) => void
    wsMessages: Array<MessageEvent>
    setWsMessages: (messages: Array<MessageEvent>) => void
}

export const WebsocketContext = createContext<WebsocketContextType>({
    ws: null,
    isConnected: false,
    sendWebsocketMessageToServer: (message: ClientMessage) => undefined,
    wsMessages: [],
    setWsMessages: () => undefined,
})

interface WebsocketProviderProps {
    children: ReactNode
}

function isBinary(obj: any) {
    return (
        typeof obj === 'object' &&
        Object.prototype.toString.call(obj) === '[object Blob]'
    )
}

interface WebSocketExt extends WebSocket {
    pingTimeout?: NodeJS.Timeout
}

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({
    children,
}) => {
    const [ws, setWs] = useState<WebSocketExt | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [wsMessages, setWsMessages] = useState<any[]>([])

    const addMessage = (message: MessageEvent) => {
        const updatedMessages = [...wsMessages, message]
        setWsMessages(updatedMessages)
    }

    const reconnect = () => {}

    const heartbeat = () => {
        if (!ws) {
            return
        } else if (!!ws.pingTimeout) {
            clearTimeout(ws.pingTimeout)
        }

        ws.pingTimeout = setTimeout(() => {
            console.log('Terminating connection due to heartbeat timeout')
            ws.close()
            reconnect()
        }, HEARTBEAT_TIMEOUT)

        const data = new Uint8Array(1)

        data[0] = HEARTBEAT_VALUE

        ws.send(data)
    }

    useEffect(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket connection already open')
            return
        }
        console.log('Connecting to WebSocket server...')

        const socket: WebSocketExt = new WebSocket('ws://localhost:8080')

        socket.onopen = () => {
            console.log('Successfuly Connected to WebSocket server!')
            setIsConnected(true)
        }

        socket.onclose = () => {
            console.log('WebSocket connection closed')
            setIsConnected(false)
        }

        socket.onmessage = (event) => {
            if (isBinary(event.data)) {
                console.log('Received binary data:', event.data)
                heartbeat()
            } else {
                addMessage(event)
            }
        }

        socket.addEventListener('close', () => {
            if (!!socket.pingTimeout) {
                clearTimeout(socket.pingTimeout)
            }
        })

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
            value={{
                ws,
                isConnected,
                wsMessages,
                sendWebsocketMessageToServer,
                setWsMessages,
            }}
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

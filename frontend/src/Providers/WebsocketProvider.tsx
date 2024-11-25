import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { ClientMessage } from './Models'
import { useAuthContext } from './AuthProvider'
import { useSnackbar } from '../Components/SnackBars'
import { USE_SSL } from '../config'
import { reconnectWS } from './ws/ReconnectService'

const HEARTBEAT_TIMEOUT = 1000 * 5 + 1000 * 1
const HEARTBEAT_VALUE = 1
const COOKIE_AT_KEY = 'at'

interface WebsocketContextType {
    ws: WebSocket | null
    isConnected: boolean
    sendWebsocketMessageToServer: (message: ClientMessage) => void
    wsMessages: Array<MessageEvent>
    setWsMessages: (messages: Array<MessageEvent>) => void
    isDisconnected: boolean
    setIsDisconnected: (isDisconnected: boolean) => void
    reconnect: () => void
    closeWebsocketConnection: () => void
    connectToWebsocketServer: () => void
}

export const WebsocketContext = createContext<WebsocketContextType>({
    ws: null,
    isConnected: false,
    sendWebsocketMessageToServer: (message: ClientMessage) => undefined,
    wsMessages: [],
    setWsMessages: () => undefined,
    isDisconnected: false,
    setIsDisconnected: () => undefined,
    reconnect: () => undefined,
    closeWebsocketConnection: () => undefined,
    connectToWebsocketServer: () => undefined,
})

interface WebsocketProviderProps {
    children: ReactNode
}

function isBinary(data: any) {
    return (
        data instanceof ArrayBuffer ||
        data instanceof Uint8Array ||
        Object.prototype.toString.call(data) === '[object Blob]'
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
    const [isDisconnected, setIsDisconnected] = useState<boolean>(false)
    const addMessage = (message: MessageEvent) => {
        const updatedMessages = [...wsMessages, message]
        setWsMessages(updatedMessages)
    }

    const { addMessage: AddSnackbarMessage } = useSnackbar()
    const { isAuthorized, user } = useAuthContext()

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

    const connectToWebsocketServer = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket connection already open')
            return
        }

        const protocole = USE_SSL ? 'wss' : 'ws'
        const socket: WebSocketExt = new WebSocket(
            `${protocole}://localhost:8080?${COOKIE_AT_KEY}=${user?.jwt}`,
        )
        console.log('Connecting to WebSocket server...')

        socket.onopen = () => {
            console.log('Successfuly Connected to WebSocket server!')
            setIsConnected(true)
            setIsDisconnected(false)
        }

        socket.onclose = () => {
            console.log('WebSocket connection closed')
            setIsConnected(false)
            setIsDisconnected(true)
        }

        socket.onmessage = (event) => {
            AddSnackbarMessage(
                `Received message from server -${event.data} `,
                'info',
            )
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
    }

    // useEffect(() => {
    //     console.log()
    //     if (!isConnected) {
    //         connectToWebsocketServer()
    //     }
    // }, [isAuthorized])

    let dupa = false
    useEffect(() => {
        if (!isConnected && !dupa) {
            console.log('di[a')
            connectToWebsocketServer()
        }
        dupa = true
    }, [])

    const closeWebsocketConnection = () => {
        if (ws) {
            ws.onopen = null
            ws.onclose = null
            ws.onmessage = null
            if (ws.pingTimeout) {
                clearTimeout(ws.pingTimeout)
            }
            ws.close()
            setWs(null)
            setIsConnected(false)
            setIsDisconnected(true)
        }
    }

    const reconnect = () => {
        reconnectWS({
            connectToWebsocketServer,
            setIsDisconnected,
            ws,
        })
    }

    const sendWebsocketMessageToServer = async (message: ClientMessage) => {
        if (!user) {
            AddSnackbarMessage(
                'User not authorized to send messages to server',
                'error',
            )
        }
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ ...message, token: user?.jwt }))
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
                isDisconnected,
                setIsDisconnected,
                reconnect,
                closeWebsocketConnection,
                connectToWebsocketServer,
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

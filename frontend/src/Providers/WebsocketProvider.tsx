import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useAuthContext } from './AuthProvider'
import { BACKEND_HOST_NAME, USE_SSL } from '../config'
import { ClientMessage, ServerMessage } from './ws/WebsocketDataModels'

const HEARTBEAT_TIMEOUT = 1000 * 2 * 5 + 1000 * 1

interface WebsocketContextType {
    ws: WebSocket | null
    wsMessages: Array<MessageEvent>
    isConnected: boolean
    isDisconnected: boolean
    showReconnectPage: boolean
    reconnect: () => void
    setWsMessages: (messages: Array<MessageEvent>) => void
    setIsDisconnected: (isDisconnected: boolean) => void
    setShowReconnectPage: (showReconnectPage: boolean) => void
    closeWebsocketConnection: () => void
    connectToWebsocketServer: () => void
    sendWebsocketMessageToServer: (message: ClientMessage) => void
}

export const WebsocketContext = createContext<WebsocketContextType>({
    ws: null,
    wsMessages: [],
    isConnected: false,
    isDisconnected: false,
    showReconnectPage: false,
    reconnect: () => undefined,
    setWsMessages: () => undefined,
    setIsDisconnected: () => undefined,
    setShowReconnectPage: () => undefined,
    closeWebsocketConnection: () => undefined,
    connectToWebsocketServer: () => undefined,
    sendWebsocketMessageToServer: (message: ClientMessage) => undefined,
})

interface WebsocketProviderProps {
    children: ReactNode
}

function isPing(data: ServerMessage) {
    if (data.eventName === 'PING') {
        return true
    }
    return false
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
    const [showReconnectPage, setShowReconnectPage] = useState<boolean>(false)
    const addMessage = (message: MessageEvent) => {
        const updatedMessages = [...wsMessages, message]
        setWsMessages(updatedMessages)
    }
    const { user } = useAuthContext()

    const heartbeat = (wsArg: WebSocketExt) => {
        console.log('heartbeat')
        if (!wsArg) {
            console.log('No WebSocket connection')
            return
        } else if (!!wsArg.pingTimeout) {
            console.log('Clearing pingTimeout')
            clearTimeout(wsArg.pingTimeout)
        }
        wsArg.pingTimeout = setTimeout(() => {
            console.log('Terminating connection due to heartbeat timeout')
            wsArg.close()
            setShowReconnectPage(true)
        }, HEARTBEAT_TIMEOUT)

        const pongMessage: ClientMessage = {
            eventName: 'PONG',
            payload: null,
        }
        console.log('Sending PONG message to server')
        wsArg.send(JSON.stringify(pongMessage))
    }

    const connectToWebsocketServer = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket connection already open')
            setIsConnected(true)
            setIsDisconnected(false)
            return
        }

        const protocole = USE_SSL ? 'wss' : 'ws'
        const socket: WebSocketExt = new WebSocket(
            `${protocole}://${BACKEND_HOST_NAME}?`,
        )
        console.log('Connecting to WebSocket server...')

        socket.onopen = () => {
            console.log('Successfully Connected to WebSocket server!')
            setIsConnected(true)
            setIsDisconnected(false)
        }

        socket.onclose = () => {
            setIsConnected(false)
            setIsDisconnected(true)
        }

        socket.onmessage = async (event) => {
            console.log('Received message from server:', event.data)
            if (isPing(JSON.parse(event.data))) {
                heartbeat(socket)
            } else {
                addMessage(event)
            }
        }

        socket.addEventListener('close', () => {
            if (socket.pingTimeout) {
                clearTimeout(socket.pingTimeout)
            }
        })

        setWs(socket)
        return () => {
            socket.close()
        }
    }

    const closeWebsocketConnection = () => {
        if (ws) {
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
        if (ws) {
            ws.onopen = null
            ws.onclose = null
            ws.onmessage = null
            if (ws.pingTimeout) {
                clearTimeout(ws.pingTimeout)
            }
            ws.close()
        }
        connectToWebsocketServer()
    }

    const sendWebsocketMessageToServer = async (message: ClientMessage) => {
        console.log('Sending message to server:', message)
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message))
        }
    }

    return (
        <WebsocketContext.Provider
            value={{
                ws,
                wsMessages,
                isConnected,
                isDisconnected,
                showReconnectPage,
                reconnect,
                setWsMessages,
                setIsDisconnected,
                setShowReconnectPage,
                closeWebsocketConnection,
                connectToWebsocketServer,
                sendWebsocketMessageToServer,
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

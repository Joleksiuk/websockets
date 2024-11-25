type ReconnectParams = {
    connectToWebsocketServer: () => void
    setIsDisconnected: (isDisconnected: boolean) => void
    ws: WebSocket | null
}

export const reconnectWS = ({
    connectToWebsocketServer,
    setIsDisconnected,
    ws,
}: ReconnectParams) => {
    const MAX_RETRIES = 5
    const RETRY_DELAY = 2000
    let retryCount = 0

    const attemptReconnect = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            console.log(
                'Connection is already open. Stopping reconnection attempts.',
            )
            setIsDisconnected(false)
            return
        }

        if (retryCount >= MAX_RETRIES) {
            console.error(
                'Max reconnection attempts reached. Aborting reconnect.',
            )
            setIsDisconnected(true)
            return
        }

        console.log(`Reconnecting... Attempt ${retryCount + 1}/${MAX_RETRIES}`)
        retryCount++

        // Attempt to reconnect
        connectToWebsocketServer()

        // Retry after a delay only if the connection is not established
        setTimeout(() => {
            if (!(ws && ws.readyState === WebSocket.OPEN)) {
                attemptReconnect()
            } else {
                console.log('Reconnection successful!')
                setIsDisconnected(false)
            }
        }, RETRY_DELAY)
    }

    attemptReconnect() // Start the reconnection attempts
}

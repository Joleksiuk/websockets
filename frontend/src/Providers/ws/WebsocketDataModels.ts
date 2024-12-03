export type ServerMessage = {
    eventName: string
    payload: any
}

export type ClientMessage<TPayload = any> = {
    eventName: string
    payload: TPayload
}

export type UserJoinedClientMessage = ClientMessage<{
    roomId: number
    userId: number
}>

export type ClientMessage = {
    activity: 'JOIN ROOM' | 'LEAVE ROOM' | 'MESSAGE'
    roomId: string
    username: string
    timestamp: number
    message: string
}

export type ClientMessageWithToken = {
    activity: 'JOIN ROOM' | 'LEAVE ROOM' | 'MESSAGE'
    roomId: string
    username: string
    timestamp: number
    message: string
    token: string
}

export type ServerMessage = {
    activity:
        | 'USER JOINED ROOM'
        | 'USER LEFT ROOM'
        | 'USER SENT MESSAGE'
        | 'ROOM CLOSED'
        | 'INVALID AUTHENTICATION'

    roomId: string
    username: string
    timestamp: number
    message: string
}

export type ServerActivity =
    | 'USER JOINED ROOM'
    | 'USER LEFT ROOM'
    | 'USER SENT MESSAGE'
    | 'ROOM CLOSED'
    | 'INVALID AUTHENTICATION'

export type ServerMessageBase = {
    activity: ServerActivity
    username: string
    timestamp: number
}

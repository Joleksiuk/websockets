export type ClientMessage = {
    activity: 'CREATE ROOM' | 'JOIN ROOM' | 'LEAVE ROOM' | 'MESSAGE'
    roomId: string
    password: string | null
    username: string
    timestamp: number
    message: string
}

export type ServerMessage = {
    activity:
        | 'USER JOINED ROOM'
        | 'USER LEFT ROOM'
        | 'USER SENT MESSAGE'
        | 'ROOM CLOSED'
        | 'ROOM CREATED'
        | 'INVALID AUTHENTICATION'

    roomId: string
    username: string
    timestamp: number
    message: string
    password: string
}

export type ServerActivity =
    | 'USER JOINED ROOM'
    | 'USER LEFT ROOM'
    | 'USER SENT MESSAGE'
    | 'ROOM CLOSED'
    | 'ROOM CREATED'
    | 'INVALID AUTHENTICATION'

export type ServerMessageBase = {
    activity: ServerActivity
    username: string
    timestamp: number
}

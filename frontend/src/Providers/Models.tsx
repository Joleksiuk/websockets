export type ClientMessage = {
    activity: 'CREATE ROOM' | 'JOIN ROOM' | 'LEAVE ROOM' | 'MESSAGE'
    roomId: string
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
    roomId: string
    username: string
    timestamp: number
    message: string
}

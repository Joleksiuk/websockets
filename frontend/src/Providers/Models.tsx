export type ChatroomActivity = {
    activity: 'CREATE ROOM' | 'JOIN ROOM' | 'MESSAGE' | 'LEAVE ROOM'
    roomId: string
    username: string
    timestamp: number
    message: string
}

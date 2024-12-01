import { SECURE_BACKEND_URL } from '../config'
import { request } from './APIService'

export type RoomUser = {
    id: number
    username: string
}

export type Room = {
    id: string
    name: string
    ownerId: number
    authorizedUsers: RoomUser[]
}

export async function sendCreateRoomRequest(
    name: string,
    password: string,
): Promise<any> {
    try {
        const response = await request(`${SECURE_BACKEND_URL}/rooms`, 'post', {
            name,
            password,
        })
        return response
    } catch (error) {
        console.error('Error create room request:', error)
    }
}

export async function getRoomById(roomId: string): Promise<Room> {
    try {
        const response: Room = (await request(
            `${SECURE_BACKEND_URL}/rooms/${roomId}`,
            'get',
        )) as Room
        return response
    } catch (error) {
        console.error('Error get room by id request:', error)
        return {} as Room
    }
}

export async function addUserToChatroom(
    roomId: string,
    userId: number,
): Promise<any> {
    try {
        const response = await request(
            `${SECURE_BACKEND_URL}/rooms/${roomId}/users/add`,
            'put',
            {
                userId,
            },
        )
        return response
    } catch (error) {
        console.error('Error add user to chatroom request:', error)
    }
}

export async function removeUserFromChatroom(
    roomId: string,
    userId: number,
): Promise<any> {
    try {
        const response = await request(
            `${SECURE_BACKEND_URL}/rooms/${roomId}/users/remove`,
            'delete',
            {
                userId,
            },
        )
        return response
    } catch (error) {
        console.error('Error remove user from chatroom request:', error)
    }
}

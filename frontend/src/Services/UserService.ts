import { SECURE_BACKEND_URL } from '../config'
import { request } from './APIService'

export type UserResponse = {
    id: number
    username: string
}

export async function getAllUsers(jwt: string): Promise<Array<UserResponse>> {
    try {
        const response: Array<UserResponse> = (await request(
            `${SECURE_BACKEND_URL}/users`,
            'get',
            null,
            jwt,
        )) as Array<UserResponse>
        return response
    } catch (error) {
        console.error('Error during fetching users:', error)
        return []
    }
}

export async function getAllUsersByName(
    name: string,
    jwt: string,
): Promise<Array<UserResponse>> {
    try {
        const response: Array<UserResponse> = (await request(
            `${SECURE_BACKEND_URL}/users?name=${name}`,
            'get',
            null,
            jwt,
        )) as Array<UserResponse>
        return response
    } catch (error) {
        console.error('Error during fetching users:', error)
        return []
    }
}

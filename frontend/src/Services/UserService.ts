import { BACKEND_URL } from '../config'
import { request } from './APIService'

export async function getAllUsers(jwt: string): Promise<any> {
    try {
        const response = await request(`${BACKEND_URL}/users`, 'get', null, jwt)
        return response
    } catch (error) {
        console.error('Error during fetching users:', error)
    }
}

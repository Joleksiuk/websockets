import { SECURE_BACKEND_URL, BACKEND_URL } from '../config'
import { request } from './APIService'

export async function getMyself(): Promise<any> {
    try {
        const response = await request(`${SECURE_BACKEND_URL}/myself`, 'get')
        return response
    } catch (error) {
        console.error('Error during get myself request:', error)
    }
}

export async function sendLoginRequest(
    username: string,
    password: string,
): Promise<any> {
    try {
        const response = await request(`${BACKEND_URL}/login`, 'post', {
            username,
            password,
        })
        return response
    } catch (error) {
        console.error('Error during login request:', error)
    }
}

export async function sendLogoutRequest() {
    try {
        await request(`${SECURE_BACKEND_URL}/logout`, 'post')
    } catch (error) {
        console.error('Error during logout request:', error)
        throw error
    }
}

export async function sendRegisterRequest(username: string, password: string) {
    try {
        const data = {
            username,
            password,
            role: 'user',
        }
        const response = await request(`${BACKEND_URL}/users`, 'post', data)
        return response
    } catch (error) {
        console.error('Error during sign up request:', error)
    }
}

import axios from 'axios'
import { BACKEND_URL } from '../config'

export async function sendLoginRequest(
    username: string,
    password: string,
): Promise<any> {
    const response = await axios.post(
        `${BACKEND_URL}/login`,
        {
            username,
            password,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    )
    return response
}

export async function sendRegisterRequest(username: string, password: string) {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/users`,
            {
                username,
                password,
                role: 'user',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        return response.data
    } catch (error) {
        console.error('Error during register request:', error)
        throw error
    }
}

export async function sendLogoutRequest() {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/logout`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        return response.data
    } catch (error) {
        console.error('Error during logout request:', error)
        throw error
    }
}

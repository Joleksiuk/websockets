import axios from 'axios'

export async function request(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    jwt?: string,
) {
    try {
        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        let config = {
            method,
            url,
            headers,
            withCredentials: true,
            ...(data && { data }),
        }

        const response = await axios(config)
        return response.data
    } catch (error) {
        console.error('Something wrong with request:', error)
        throw error
    }
}

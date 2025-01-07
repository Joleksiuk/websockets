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

        if (jwt) {
            headers['Authorization'] = `Bearer ${jwt}`
        }

        let config = {
            method,
            url,
            headers,
            timeout: 5000,
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

export async function requestWithStatus(
    url: string,
    method: 'get' | 'post' | 'put' | 'delete',
    data?: any,
    jwt?: string,
) {
    try {
        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        if (jwt) {
            headers['Authorization'] = `Bearer ${jwt}`
        }

        let config = {
            method,
            url,
            headers,
            timeout: 5000,
            withCredentials: true,
            ...(data && { data }),
        }

        const response = await axios(config)
        return response
    } catch (error) {
        const axiosError = error as any
        return {
            status: axiosError.response.status,
        }
    }
}

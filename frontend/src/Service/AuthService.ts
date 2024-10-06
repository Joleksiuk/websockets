import { LOCAL_STORAGE_KEY } from './AuthProvider'

const AuthService = {
    login: (username: string) => {
        try {
            if (!username || typeof username !== 'string') {
                throw new Error('Invalid username')
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, username)
        } catch (error: any) {
            console.error('Login failed:', error.message)
        }
    },

    logout: () => {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY)
        } catch (error: any) {
            console.error('Logout failed:', error.message)
        }
    },

    getLoggedUser: () => {
        try {
            const user = localStorage.getItem(LOCAL_STORAGE_KEY)
            if (!user) {
                console.warn('No user is currently logged in')
                return null
            }
            return user
        } catch (error: any) {
            console.error('Error retrieving logged user:', error.message)
            return null
        }
    },
}

export default AuthService

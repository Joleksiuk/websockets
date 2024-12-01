import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import {
    getMyself,
    sendLoginRequest,
    sendLogoutRequest,
} from '../Services/AuthService'

export type User = {
    userId: string
    username: string
    jwt: string
}

export type AuthPageType = 'signin' | 'signup'
interface AuthContextType {
    user: User | null
    login: (username: string, jwt: string) => void
    logout: () => void
    currentPage: AuthPageType
    setCurrentPage: (page: AuthPageType) => void
    isAuthenticating: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const USER_COOKIE_KEY = 'chat-app-logged-user'
export const ROOMS_COOKIE_KEY = 'chat-app-rooms'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [currentPage, setCurrentPage] = useState<AuthPageType>('signin')
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

    const initializeAuth = async () => {
        try {
            setIsAuthenticating(true)
            const user: User = await getMyself()
            console.log('User:', user)
            setUser(user)
        } catch (error) {
            console.error('Failed to get myself:', error)
        } finally {
            setIsAuthenticating(false)
        }
    }

    useEffect(() => {
        initializeAuth()
    }, [])

    const login = async (username: string, password: string) => {
        const user = await sendLoginRequest(username, password)
        setUser(user)
    }

    const logout = async () => {
        await sendLogoutRequest()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                currentPage,
                setCurrentPage,
                isAuthenticating,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}

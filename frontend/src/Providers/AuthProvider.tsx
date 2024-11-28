import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import Cookies from 'js-cookie'
import {
    getMyself,
    sendLoginRequest,
    sendLogoutRequest,
} from '../Services/AuthService'

export type Room = {
    roomId: string
    password: string
}

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
    rooms: Room[]
    setRooms: (rooms: Room[]) => void
    getPassword: (roomId: string | undefined) => string
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
    const [rooms, setRooms] = useState<Room[]>([])
    const [currentPage, setCurrentPage] = useState<AuthPageType>('signin')
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

    const initializeAuth = async () => {
        try {
            const user: User = await getMyself()
            setUser(user)
        } catch (error) {
            console.error('Failed to get myself:', error)
        }
    }

    useEffect(() => {
        setIsAuthenticating(true)
        initializeAuth()

        const storedRooms = Cookies.get(ROOMS_COOKIE_KEY)
        if (storedRooms) {
            try {
                setRooms(JSON.parse(storedRooms))
            } catch (error) {
                console.error('Failed to parse rooms from cookies:', error)
            }
        }
        setIsAuthenticating(false)
    }, [])

    const login = async (username: string, password: string) => {
        const user = await sendLoginRequest(username, password)
        setUser(user)
    }

    const logout = async () => {
        await sendLogoutRequest()
        setUser(null)
    }

    const handleSetRooms = (rooms: Room[]) => {
        Cookies.set(ROOMS_COOKIE_KEY, JSON.stringify(rooms), {
            expires: 7,
            secure: true,
            sameSite: 'strict',
        })
        setRooms(rooms)
    }

    const getPassword = (roomId: string | undefined) => {
        if (!roomId) {
            return 'wrong room id'
        }
        const room = rooms.find((room) => room.roomId === roomId)
        return room ? room.password : 'wrong room id'
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                rooms,
                setRooms: handleSetRooms,
                getPassword,
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

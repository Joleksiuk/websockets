import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import Cookies from 'js-cookie'

export type Room = {
    roomId: string
    password: string
}

export type User = {
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
    isAuthorized: boolean
    setIsAuthorized: (isAuthorized: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const USER_COOKIE_KEY = 'chat-app-logged-user'
export const ROOMS_COOKIE_KEY = 'chat-app-rooms'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    //TODO: handle refresh token
    const [user, setUser] = useState<User | null>(null)
    const [rooms, setRooms] = useState<Room[]>([])
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<AuthPageType>('signin')

    useEffect(() => {
        const storedUser = Cookies.get(USER_COOKIE_KEY)
        if (storedUser) {
            const user: User = JSON.parse(storedUser)
            setUser(user)
        }

        const storedRooms = Cookies.get(ROOMS_COOKIE_KEY)
        if (storedRooms) {
            try {
                setRooms(JSON.parse(storedRooms))
            } catch (error) {
                console.error('Failed to parse rooms from cookies:', error)
            }
        }
    }, [])

    const login = (username: string, jwt: string) => {
        const user = { username, jwt }
        Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), {
            expires: 7,
            secure: true,
            sameSite: 'strict',
        })
        setUser(user)
    }

    const logout = () => {
        Cookies.remove(USER_COOKIE_KEY)
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
                isAuthorized,
                setIsAuthorized,
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

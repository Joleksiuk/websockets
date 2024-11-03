import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export type Room = {
    roomId: string
    password: string
}

export type AuthPageType = 'signin' | 'signup'
interface AuthContextType {
    user: string | null
    login: (username: string) => void
    logout: () => void
    getUser: () => string | undefined
    rooms: Room[]
    setRooms: (rooms: Room[]) => void
    getPassword: (roomId: string) => string | null
    currentPage: AuthPageType
    setCurrentPage: (page: AuthPageType) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const USER_COOKIE_KEY = 'chat-app-logged-user'
export const ROOMS_COOKIE_KEY = 'chat-app-rooms'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null)
    const [rooms, setRooms] = useState<Room[]>([])

    const [currentPage, setCurrentPage] = useState<AuthPageType>('signin')

    const navigate = useNavigate()

    useEffect(() => {}, [user])

    useEffect(() => {
        const storedUser = Cookies.get(USER_COOKIE_KEY)
        if (storedUser) {
            setUser(storedUser) // Set the user if the cookie exists
        }

        const storedRooms = Cookies.get(ROOMS_COOKIE_KEY)
        if (storedRooms) {
            try {
                setRooms(JSON.parse(storedRooms)) // Parse JSON if it exists
            } catch (error) {
                console.error('Failed to parse rooms from cookies:', error)
            }
        }
    }, [])

    const login = (username: string) => {
        Cookies.set(USER_COOKIE_KEY, username, {
            expires: 7,
            secure: true,
            sameSite: 'strict',
        })
        setUser(username)
    }

    const logout = () => {
        Cookies.remove(USER_COOKIE_KEY)
        setUser(null)
        navigate(`/`)
    }

    const getUser = () => {
        if (user === null) {
            const storedUser = Cookies.get(USER_COOKIE_KEY)
            if (storedUser) {
                setUser(storedUser)
            }
            return storedUser
        }
        return user
    }

    const handleSetRooms = (rooms: Room[]) => {
        Cookies.set(ROOMS_COOKIE_KEY, JSON.stringify(rooms), {
            expires: 7,
            secure: true,
            sameSite: 'strict',
        })
        setRooms(rooms)
    }

    const getPassword = (roomId: string) => {
        const room = rooms.find((room) => room.roomId === roomId)
        return room ? room.password : null
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                getUser,
                login,
                logout,
                rooms,
                setRooms: handleSetRooms,
                getPassword,
                currentPage,
                setCurrentPage,
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

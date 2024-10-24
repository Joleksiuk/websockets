import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'

export type Room = {
    roomId: string
    password: string
}

interface AuthContextType {
    user: string | null
    login: (username: string) => void
    logout: () => void
    getUser: () => string | null
    rooms: Room[]
    setRooms: (rooms: Room[]) => void
    getPassword: (roomId: string) => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const LOCAL_STORAGE_KEY = 'chat-app-logged-user'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null)
    const [rooms, setRooms] = useState<Room[]>([])

    const navigate = useNavigate()
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedUser) {
            setUser(storedUser)
        }
    }, [])

    const login = (username: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, username)
        setUser(username)
    }

    const logout = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        setUser(null)
        navigate(`/`)
    }

    const getUser = () => {
        if (user === null) {
            const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY)
            if (storedUser) {
                setUser(storedUser)
            }
            console.log(storedUser)
            return storedUser
        }
        return null
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
                setRooms,
                getPassword,
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

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'

interface AuthContextType {
    user: string | null
    login: (username: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const LOCAL_STORAGE_KEY = 'chat-app-logged-user'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null)

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
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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

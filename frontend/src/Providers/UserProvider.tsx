/* eslint-disable react-hooks/exhaustive-deps */
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react'
import { getAllUsersByName, UserResponse } from '../Services/UserService'
import { useAuthContext } from './AuthProvider'

interface UsersContextType {
    allUsers: UserResponse[]
    isLoadingAllUsers: boolean
}

export const UsersContext = createContext<UsersContextType>({
    allUsers: [],
    isLoadingAllUsers: false,
})

interface UsersProviderProps {
    children: ReactNode
}

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<UserResponse[]>([])
    const [isLoadingAllUsers, setIsLoadingAllUsers] = useState(false)

    const { user } = useAuthContext()

    const fetchUsers = async () => {
        if (!user) {
            return
        }
        try {
            setIsLoadingAllUsers(true)
            const users: UserResponse[] = await getAllUsersByName('', user.jwt)
            setAllUsers(users)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsLoadingAllUsers(false)
        }
    }

    useEffect(() => {
        if (user !== null) {
            fetchUsers()
        }
    }, [user])

    return (
        <UsersContext.Provider value={{ allUsers, isLoadingAllUsers }}>
            {children}
        </UsersContext.Provider>
    )
}

export const useUsersContext = (): UsersContextType => {
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error('useUsers must be used within a ChatProvider')
    }
    return context
}

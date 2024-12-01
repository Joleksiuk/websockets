import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useEffect, useState } from 'react'
import { getAllUsersByName, UserResponse } from '../../Services/UserService'
import { useAuthContext } from '../../Providers/AuthProvider'
import { CircularProgress, ThemeProvider } from '@mui/material'
import { theme } from '../Inputs/TextInput.styled'
import { useModeContext } from '../../Providers/ModeProvider'

export default function UserSearch() {
    const [users, setUsers] = useState<UserResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const { mode } = useModeContext()
    const { user } = useAuthContext()

    const fetchUsers = async () => {
        if (!user) {
            return
        }
        try {
            setIsLoading(true)
            const users: UserResponse[] = await getAllUsersByName('', user.jwt)
            setUsers(users)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const mapUsersToOptions = (users: any) => {
        const usernames: string[] = users.map((user: any) => user.username)
        return usernames
    }

    useEffect(() => {
        if (user !== null) {
            fetchUsers()
        }
    }, [user])

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <Autocomplete
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                disablePortal
                options={mapUsersToOptions(users)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="User" />}
                loading={isLoading}
            />
        </ThemeProvider>
    )
}

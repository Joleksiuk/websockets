import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { useState } from 'react'
import { UserResponse } from '../../Services/UserService'
import { Button, ThemeProvider } from '@mui/material'
import { theme } from '../Inputs/TextInput.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import { UserSearchContainerStyled } from './UserSearch.styled'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import { useUsersContext } from '../../Providers/UserProvider'

export default function UserSearch() {
    const [inputValue, setInputValue] = useState('')
    const { mode } = useModeContext()
    const { chatroomUsers, addChatroomUser } = useChatroomContext()
    const { allUsers, isLoadingAllUsers } = useUsersContext()

    const mapUsersToOptions = (users: UserResponse[]): string[] => {
        const usernames: string[] = users.map(
            (user: UserResponse) => user.username,
        )

        const filteredUsernames: string[] = usernames.filter((username) => {
            return !chatroomUsers.some((user) => user.username === username)
        })

        return filteredUsernames
    }

    const handleAddUser = () => {
        const user = allUsers.find((user) => user.username === inputValue)
        if (user) {
            addChatroomUser(user.id)
        }
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <UserSearchContainerStyled>
                <Autocomplete
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    disablePortal
                    options={mapUsersToOptions(allUsers)}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                        <TextField {...params} label="User" />
                    )}
                    loading={isLoadingAllUsers}
                />
                <Button onClick={handleAddUser}>Dodaj</Button>
            </UserSearchContainerStyled>
        </ThemeProvider>
    )
}

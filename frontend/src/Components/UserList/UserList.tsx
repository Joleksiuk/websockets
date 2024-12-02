import {
    UserListContainerStyled,
    UserListStyled,
    AddUserContainerStyled,
} from './UserList.styled'
import { ThemeProvider, Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import { theme } from '../Inputs/TextInput.styled'
import UserSearch from '../UserSearch/UserSearch' // Import your UserSearch component
import UserComponent from './UserComponent'
import { useAuthContext } from '../../Providers/AuthProvider'

export default function UserList() {
    const { mode } = useModeContext()
    const { chatroomUsers, room } = useChatroomContext()
    const { user } = useAuthContext()

    return (
        <ThemeProvider theme={theme(mode)}>
            <UserListContainerStyled mode={mode}>
                <UserListStyled>
                    {chatroomUsers.length === 0 && (
                        <Typography
                            variant="h6"
                            color={getColorInMode('TEXT', mode)}
                        >
                            No other users in chatroom
                        </Typography>
                    )}
                    {chatroomUsers.map((user, index) => (
                        <UserComponent
                            key={`user-component-${index}`}
                            user={user}
                            index={index}
                        />
                    ))}
                </UserListStyled>
                {room?.ownerId === user?.userId && (
                    <AddUserContainerStyled>
                        <UserSearch />
                    </AddUserContainerStyled>
                )}
            </UserListContainerStyled>
        </ThemeProvider>
    )
}

import { UserListStyled, UserStyled } from './UserList.styled'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import Avatar from '../Avatar/Avatar'
import { useChatroomContext } from '../../Providers/ChatroomProvider'

export default function UserList() {
    const { mode } = useModeContext()
    const { chatroomUsers } = useChatroomContext()
    return (
        <UserListStyled mode={mode}>
            {chatroomUsers.map((user, index) => {
                return (
                    <UserStyled key={index}>
                        <Avatar username={user} />
                        <Typography
                            variant="h6"
                            color={getColorInMode('TEXT', mode)}
                        >
                            {user}
                        </Typography>
                    </UserStyled>
                )
            })}
        </UserListStyled>
    )
}

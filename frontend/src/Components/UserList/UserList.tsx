import { UserListStyled, UserStyled } from './UserList.styled'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import Avatar from '../Avatar/Avatar'

const userList: string[] = ['Christofer', 'Micheal', 'Cathrine', 'Oliver']

export default function UserList() {
    const { mode } = useModeContext()
    return (
        <UserListStyled mode={mode}>
            {userList.map((user, index) => {
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

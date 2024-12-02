import { ChatroomUser } from '../../Providers/ChatroomProvider'
import { Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import {
    ActivityCircleStyled,
    CircleContainerStyled,
    UserStyled,
} from './UserList.styled'
import { useModeContext } from '../../Providers/ModeProvider'
import Avatar from '../Avatar/Avatar'

type Props = {
    index: number
    user: ChatroomUser
}

export default function UserComponent({ user, index }: Props) {
    const { mode } = useModeContext()
    return (
        <UserStyled key={index}>
            <Avatar username={user.username} />
            <Typography variant="h6" color={getColorInMode('TEXT', mode)}>
                {user.username}
            </Typography>
            <CircleContainerStyled>
                <ActivityCircleStyled
                    color={user.isActive ? '#12d122' : '#7c3438'}
                />
            </CircleContainerStyled>
        </UserStyled>
    )
}

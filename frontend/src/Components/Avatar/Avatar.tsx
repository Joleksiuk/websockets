import AvatarUtils from './AvatarUtils'
import { AvatarStyled } from './Avatar.styled'
import { useAuthContext } from '../../Providers/AuthProvider'

type Props = {
    otherUser?: boolean
    username?: string
}

export default function Avatar({
    username = 'Anonymus',
    otherUser = false,
}: Props): JSX.Element {
    const { user } = useAuthContext()
    const currentUser = user ? user.username : username
    const avatarSeed = otherUser ? currentUser : username
    return <AvatarStyled>{AvatarUtils.getAvatar(avatarSeed)}</AvatarStyled>
}

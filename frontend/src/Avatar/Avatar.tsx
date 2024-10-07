import AvatarUtils from './AvatarUtils'
import { AvatarStyled } from './Avatar.styled'
import { useAuthContext } from '../Service/AuthProvider'

export default function Avatar() {
    const { user } = useAuthContext()
    const username = user ? user : 'Anonymous'
    return <AvatarStyled>{AvatarUtils.getAvatar(username)}</AvatarStyled>
}

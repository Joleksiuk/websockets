import AvatarUtils from './AvatarUtils'
import { AvatarStyled } from './Avatar.styled'
import { useAuthContext } from '../../Providers/AuthProvider'

export default function Avatar(): JSX.Element {
    const { user } = useAuthContext()
    const username = user ? user : 'Anonymous'
    return <AvatarStyled>{AvatarUtils.getAvatar(username)}</AvatarStyled>
}

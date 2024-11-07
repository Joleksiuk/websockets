import { Button, Typography } from '@mui/material'
import {
    ConnectionCircleStyled,
    HorizontalContainerStyled,
    NavbarStyled,
} from './Navbar.styled'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import { useAuthContext } from '../../Providers/AuthProvider'
import Avatar from '../Avatar/Avatar'
import ModeSwitch from '../../ModeSwitch/ModeSwitch'
import NavbarDropdown from './NavbarDropdown'
import { useWebsocketContext } from '../../Providers/WebsocketProvider'
import { request } from '../../Services/APIService'
import { BACKEND_URL } from '../../config'

export default function Navbar() {
    const { mode } = useModeContext()
    const { user } = useAuthContext()
    const { isConnected } = useWebsocketContext()
    const handleFetchUsers = async () => {
        try {
            const response = await request(
                `${BACKEND_URL}/users`,
                'get',
                null,
                user?.jwt,
            )
            return response
        } catch (error) {
            console.error('Error during fetching users:', error)
        }
    }

    return (
        <NavbarStyled>
            {user ? (
                <HorizontalContainerStyled>
                    <ConnectionCircleStyled connected={isConnected} />
                    <Avatar username={user.username} />
                    <Typography
                        variant="h4"
                        color={getColorInMode('TEXT', mode)}
                    >
                        {user.username}
                    </Typography>
                    <ModeSwitch />
                    <NavbarDropdown />
                    <Button onClick={() => handleFetchUsers()}>
                        Click to fetch
                    </Button>
                </HorizontalContainerStyled>
            ) : (
                <ModeSwitch />
            )}
        </NavbarStyled>
    )
}

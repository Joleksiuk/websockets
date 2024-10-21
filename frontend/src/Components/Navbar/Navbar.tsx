import { Typography } from '@mui/material'
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

export default function Navbar() {
    const { mode } = useModeContext()
    const { user } = useAuthContext()
    const { isConnected } = useWebsocketContext()
    return (
        <NavbarStyled>
            {user ? (
                <HorizontalContainerStyled>
                    <ConnectionCircleStyled connected={isConnected} />
                    <Avatar username={user} />
                    <Typography
                        variant="h4"
                        color={getColorInMode('TEXT', mode)}
                    >
                        {user}
                    </Typography>
                    <ModeSwitch />
                    <NavbarDropdown />
                </HorizontalContainerStyled>
            ) : (
                <ModeSwitch />
            )}
        </NavbarStyled>
    )
}

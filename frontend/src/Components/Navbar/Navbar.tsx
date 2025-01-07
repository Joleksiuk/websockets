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

export default function Navbar() {
    const { mode } = useModeContext()
    const { user } = useAuthContext()
    const { isConnected } = useWebsocketContext()
    const { closeWebsocketConnection, reconnect } = useWebsocketContext()
    return (
        <NavbarStyled>
            {user ? (
                <HorizontalContainerStyled>
                    <ConnectionCircleStyled
                        isConnected={isConnected.valueOf()}
                    />
                    <Avatar username={user.username} />
                    <Typography
                        variant="h4"
                        color={getColorInMode('TEXT', mode)}
                    >
                        {user.username}
                    </Typography>
                    <ModeSwitch />
                    <NavbarDropdown />
                    <Button onClick={() => closeWebsocketConnection()}>
                        Rozłącz Websocket
                    </Button>
                    <Button onClick={() => reconnect()}>
                        Połącz Websocket
                    </Button>
                </HorizontalContainerStyled>
            ) : (
                <ModeSwitch />
            )}
        </NavbarStyled>
    )
}

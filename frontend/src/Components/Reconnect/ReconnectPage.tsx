import { Button, Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import { ReconnectComponentStyled } from './ReconnectPage.styled'
import { useWebsocketContext } from '../../Providers/WebsocketProvider'

export default function ReconnectPage() {
    const { mode } = useModeContext()
    const { reconnect } = useWebsocketContext()

    const handleReconnect = () => {
        console.log('Reconnecting...')
        reconnect()
    }

    return (
        <ReconnectComponentStyled>
            <Typography color={getColorInMode('TEXT', mode)}>
                Czy jesteś aktywny?
            </Typography>
            <Button onClick={handleReconnect}>Połącz ponownie</Button>
        </ReconnectComponentStyled>
    )
}

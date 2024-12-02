import { IconButton, Menu, MenuItem, ThemeProvider } from '@mui/material'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useAuthContext } from '../../Providers/AuthProvider'
import { useModeContext } from '../../Providers/ModeProvider'
import { theme } from '../Inputs/TextInput.styled'
import { useNavigate } from 'react-router-dom'
import { useWebsocketContext } from '../../Providers/WebsocketProvider'

export default function NavbarDropdown() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const navigate = useNavigate()

    const { logout } = useAuthContext()
    const { closeWebsocketConnection } = useWebsocketContext()
    const { mode } = useModeContext()
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = async () => {
        closeWebsocketConnection()
        await logout()
        navigate(`/`)
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </ThemeProvider>
    )
}

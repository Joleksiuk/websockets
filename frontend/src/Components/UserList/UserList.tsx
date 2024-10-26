import {
    UserListContainerStyled,
    UserListStyled,
    UserStyled,
} from './UserList.styled'
import { IconButton, ThemeProvider, Typography } from '@mui/material'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'
import Avatar from '../Avatar/Avatar'
import { useChatroomContext } from '../../Providers/ChatroomProvider'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useState } from 'react'
import { theme } from '../Inputs/TextInput.styled'

export default function UserList() {
    const { mode } = useModeContext()
    const { chatroomUsers } = useChatroomContext()
    const [isExpanded, setIsExpanded] = useState(false)

    const handleChangeExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <UserListContainerStyled mode={mode}>
                <IconButton
                    onClick={handleChangeExpanded}
                    color="primary"
                    sx={{
                        width: '48px',
                        height: '48px',
                    }}
                >
                    {isExpanded ? (
                        <ArrowBackIosIcon />
                    ) : (
                        <ArrowForwardIosIcon />
                    )}
                </IconButton>
                {chatroomUsers.map((user, index) => {
                    return (
                        <UserStyled key={index}>
                            <Avatar username={user} />
                            {isExpanded && (
                                <Typography
                                    variant="h6"
                                    color={getColorInMode('TEXT', mode)}
                                >
                                    {user}
                                </Typography>
                            )}
                        </UserStyled>
                    )
                })}
            </UserListContainerStyled>
        </ThemeProvider>
    )
}

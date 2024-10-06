import { styled, Theme } from '@mui/material'
import { getColor } from '../Colors'

export const Square = styled('div')(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '80vw',
    height: '80vh',
    maxWidth: '80vh',
    maxHeight: '80vw',
    borderRadius: '16px',
    backgroundColor: `${getColor('CHAT_BACKGROUND')}`,
    overflow: 'hidden',
    padding: '20px',
    boxShadow: `${getColor('CHAT_SHADOW')}`,
}))

export const ChatStyled = styled('div')(({ theme }: { theme: Theme }) => ({
    flexGrow: 1,
    maxHeight: '100%',
    overflowY: 'auto',
    marginBottom: '16px',
    paddingRight: '8px',

    '&::-webkit-scrollbar': {
        width: '16px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: getColor('SCROLL_BACKGROUND'),
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: getColor('SCROLL_BAR'),
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: getColor('SCROLL_BAR_HOVER'),
    },
}))

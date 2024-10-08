import { styled as muiStyled, Theme } from '@mui/material'
import { getColor, ThemeType } from '../../Colors'
import styled from 'styled-components'

export const Square = muiStyled('div')(({ theme }: { theme: Theme }) => ({
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

export const ChatStyled = muiStyled('div')(({ theme }: { theme: Theme }) => ({
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

type Props = {
    mode: ThemeType
}

export const Container = styled.div<Props>`
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: ${({ mode }) =>
        mode &&
        `linear-gradient(135deg, ${getColor('BACKGROUND_GRADIENT_1')}, ${getColor('BACKGROUND_GRADIENT_2')}, ${getColor('BACKGROUND_GRADIENT_3')}, ${getColor('BACKGROUND_GRADIENT_4')}, ${getColor('BACKGROUND_GRADIENT_5')})`};
`

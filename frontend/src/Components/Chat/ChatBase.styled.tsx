import { styled as muiStyled, Theme } from '@mui/material'
import { getColorInMode, ThemeType } from '../../Colors'
import styled from 'styled-components'

type MUIProps = {
    theme?: Theme
    mode: ThemeType
}

export const Square = muiStyled('div')(({ theme, mode }: MUIProps) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '80vw',
    height: '80vh',
    maxWidth: '80vh',
    maxHeight: '80vw',
    borderRadius: '16px',
    backgroundColor: `${getColorInMode('CHAT_BACKGROUND', mode)}`,
    overflow: 'hidden',
    padding: '20px',
    boxShadow: `${getColorInMode('CHAT_SHADOW', mode)}`,
}))

export const ChatStyled = muiStyled('div')(({ theme, mode }: MUIProps) => ({
    flexGrow: 1,
    maxHeight: '100%',
    overflowY: 'auto',
    marginBottom: '16px',
    paddingRight: '8px',

    '&::-webkit-scrollbar': {
        width: '16px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: getColorInMode('SCROLL_BACKGROUND', mode),
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: getColorInMode('SCROLL_BAR', mode),
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: getColorInMode('SCROLL_BAR_HOVER', mode),
    },
}))

export const Container = styled.div<MUIProps>`
    display: flex;
    width: 100%;
    height: 100%;
`

export const ChatroomContentStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;
    width: 100%;
`

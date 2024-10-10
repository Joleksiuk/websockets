import { styled as muiStyled, Theme } from '@mui/material'
import { getColorInMode, ThemeType } from '../Colors'
import styled from 'styled-components'

type Props = {
    isRight: boolean
    mode: ThemeType
    theme?: Theme
}

export const MessageStyled = muiStyled('div')<Props>(
    ({ isRight, mode, theme }: Props) => ({
        maxWidth: '60%',
        padding: '8px 16px',
        borderRadius: '12px',
        margin: '8px 0',
        backgroundColor: isRight
            ? getColorInMode('CHAT_MESSAGE_BACKGROUND_1', mode)
            : getColorInMode('CHAT_MESSAGE_BACKGROUND_2', mode),
        color: isRight
            ? getColorInMode('CHAT_MESSAGE_TEXT_1', mode)
            : getColorInMode('CHAT_MESSAGE_TEXT_2', mode),
        alignSelf: isRight ? 'flex-end' : 'flex-start',
        textAlign: isRight ? 'right' : 'left',
        borderBottomLeftRadius: isRight ? '12px' : '0',
        borderBottomRightRadius: isRight ? '0' : '12px',
    }),
)
export const MessageContainerStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`

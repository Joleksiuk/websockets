import { styled as muiStyled } from '@mui/material'
import { getColor } from '../Colors'
import styled from 'styled-components'

export const MessageStyled = muiStyled('div')<{ isRight: boolean }>(
    ({ isRight, theme }) => ({
        maxWidth: '60%',
        padding: '8px 16px',
        borderRadius: '12px',
        margin: '8px 0',
        backgroundColor: isRight
            ? getColor('CHAT_MESSAGE_BACKGROUND_1')
            : getColor('CHAT_MESSAGE_BACKGROUND_2'),
        color: isRight
            ? getColor('CHAT_MESSAGE_TEXT_1')
            : getColor('CHAT_MESSAGE_TEXT_2'),
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

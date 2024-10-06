import { styled } from '@mui/material'

export const MessageStyled = styled('div')<{ isRight: boolean }>(({ isRight, theme }) => ({
    maxWidth: '60%',
    padding: '8px 16px',
    borderRadius: '12px',
    margin: '8px 0',
    backgroundColor: isRight ? '#5c5ed1cf' : '#6aa0f1', // Dark purple backgrounds
    color: isRight ? '#f2eef5' : '#ffffff', // Light purple text colors
    alignSelf: isRight ? 'flex-end' : 'flex-start',
    textAlign: isRight ? 'right' : 'left',
    borderBottomLeftRadius: isRight ? '12px' : '0',
    borderBottomRightRadius: isRight ? '0' : '12px',
}))

import { styled, Theme } from '@mui/material'

export const Container = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
})

export const Square = styled('div')(({ theme }: { theme: Theme }) => ({
    width: '80vw',
    height: '80vh',
    maxWidth: '80vh',
    maxHeight: '80vw',
    borderRadius: '16px',
    backgroundColor: theme.palette.primary.light,
    overflowY: 'auto',
}))

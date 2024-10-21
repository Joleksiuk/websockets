import { createTheme, PaletteMode } from '@mui/material'
import styled from 'styled-components'
import { ThemeType, getColorInMode } from '../Colors'

export const theme = (mode: ThemeType) =>
    createTheme({
        palette: {
            mode: mode as PaletteMode,
        },
        typography: {
            allVariants: {
                color: getColorInMode('HEADER_TEXT', mode),
            },
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            color: getColorInMode('TEXT', mode),
                        },
                        '& .MuiInputLabel-root': {
                            color: getColorInMode('TEXT', mode),
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: getColorInMode('TEXT', mode),
                        },
                    },
                },
            },
        },
    })

export const VerticalContainerStyled = styled.div<{ mode: ThemeType }>`
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 100px 0px;
`

export const ContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 300px;
    justify-content: center;
    align-items: center;
`

export const HorizontalContainerStyled = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 10vw;
`

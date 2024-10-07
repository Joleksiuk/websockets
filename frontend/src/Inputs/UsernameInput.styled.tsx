import { createTheme, PaletteMode } from '@mui/material'
import { getColor, getColorInMode, ThemeType } from '../Colors'
import styled from 'styled-components'

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
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        color: getColorInMode('TEXT', mode),
                        backgroundColor: getColorInMode(
                            'USERNAME_INPUT_BACKGROUND',
                            mode,
                        ),

                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'USERNAME_INPUT_BORDER',
                                mode,
                            ),
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'USERNAME_INPUT_BORDER_HOVER',
                                mode,
                            ),
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: getColorInMode(
                                'USERNAME_INPUT_BORDER_FOCUS',
                                mode,
                            ),
                        },
                        '&.Mui-focused': {
                            backgroundColor: getColorInMode(
                                'USERNAME_INPUT_BACKGROUND_FOCUS',
                                mode,
                            ),
                        },
                    },
                    input: {
                        color: getColorInMode('TEXT', mode),
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
    padding: 100px 0px;
    background: ${({ mode }) =>
        mode &&
        `linear-gradient(35deg, ${getColor('BACKGROUND_GRADIENT_1')}, ${getColor('BACKGROUND_GRADIENT_2')}, ${getColor('BACKGROUND_GRADIENT_3')}, ${getColor('BACKGROUND_GRADIENT_4')}, ${getColor('BACKGROUND_GRADIENT_5')})`};
`

export const ContainerStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;
    width: 300px;
`

export const HorizontalContainerStyled = styled.div`
    display: flex;
    gap: 20px;
`

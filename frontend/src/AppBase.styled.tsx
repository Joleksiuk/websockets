import styled from 'styled-components'
import { getColorInMode, ThemeType } from './Colors'

type Props = {
    mode: ThemeType
}

export const BasePageStyled = styled.div<Props>`
    width: 100%;
    height: 100vh;
    background: ${({ mode }) =>
        mode &&
        `linear-gradient(35deg, 
        ${getColorInMode('BACKGROUND_GRADIENT_1', mode)},
        ${getColorInMode('BACKGROUND_GRADIENT_2', mode)},
        ${getColorInMode('BACKGROUND_GRADIENT_3', mode)}, 
        ${getColorInMode('BACKGROUND_GRADIENT_4', mode)}, 
        ${getColorInMode('BACKGROUND_GRADIENT_5', mode)})`};
`

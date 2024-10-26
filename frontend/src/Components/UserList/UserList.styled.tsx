import styled from 'styled-components'
import { getColorInMode, ThemeType } from '../../Colors'

export const UserListContainerStyled = styled.div<{ mode: ThemeType }>`
    display: flex;
    flex-direction: column;
    gap: 20px;
    display: flex;
    height: 100%;
    background: ${({ mode }) => getColorInMode('SIDEBAR_BACKGROUND', mode)};
    padding: 20px;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
        rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`

export const UserStyled = styled.div`
    display: flex;
    gap: 20px;
`

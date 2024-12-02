import styled from 'styled-components'
import { getColorInMode, ThemeType } from '../../Colors'

export const UserListContainerStyled = styled.div<{ mode: ThemeType }>`
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    background: ${({ mode }) => getColorInMode('SIDEBAR_BACKGROUND', mode)};
    padding: 20px;
    box-shadow:
        rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
        rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
`

export const UserListStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-grow: 1;
`

export const UserComponentStyled = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`

export const UserStyled = styled.div`
    display: flex;
    gap: 20px;
`

export const AddUserContainerStyled = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`
export const ActivityCircleStyled = styled.div<{ color: string }>`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    justify-content: center;
`

export const CircleContainerStyled = styled.div`
    height: 100%;
    align-content: center;
`

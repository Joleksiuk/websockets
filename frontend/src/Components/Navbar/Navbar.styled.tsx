import styled from 'styled-components'

export const NavbarStyled = styled.div`
    display: flex;
    position: absolute;
    height: 64px;
    width: 100%;
    background-color: #ffffff1f;
    justify-content: flex-end;
`

export const HorizontalContainerStyled = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    gap: 1vw;
    padding: 0 1vw;
`

export const ConnectionCircleStyled = styled.div<{ connected: boolean }>`
    height: 16px;
    width: 16px;
    border-radius: 16px;
    background-color: ${({ connected }) => (connected ? '#00ff00' : '#ff0000')};
`

import styled from 'styled-components'

export const AvatarStyled = styled.div`
    height: 32px;
    width: 32px;
    border-radius: 32px;
    background-color: #d43838;
`

export const StyledImage = styled.img<{ radius?: string }>`
    border-radius: ${(props) => props.radius || '10%'};
`

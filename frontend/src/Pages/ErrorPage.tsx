import { Typography } from '@mui/material'
import { getColorInMode } from '../Colors'
import { useModeContext } from '../Providers/ModeProvider'
import styled from 'styled-components'

const ErrorPageStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

export default function ErrorPage() {
    const { mode } = useModeContext()
    return (
        <ErrorPageStyled>
            <Typography color={getColorInMode('TEXT', mode)} variant="h4">
                404 - Page not found
            </Typography>
        </ErrorPageStyled>
    )
}

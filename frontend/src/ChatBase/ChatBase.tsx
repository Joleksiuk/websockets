import React, { useEffect, useRef, useState } from 'react'
import { ChatStyled, Square } from './ChatBase.styled'
import { ThemeProvider } from '@mui/material'
import { theme } from '../Theme'
import MessageList from '../Messages/MessageList'
import TextInput from '../TextInput/TextInput'
import ModeSwitch from '../ModeSwitch/ModeSwitch'
import { getColor, ThemeType } from '../Colors'
import styled from 'styled-components'
type Props = {
    mode: ThemeType
}

export const Container = styled.div<Props>`
    display: flex;
    flex-direction: column;
    gap: 40px;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: ${({ mode }) =>
        mode &&
        `linear-gradient(135deg, ${getColor('BACKGROUND_GRADIENT_1')}, ${getColor('BACKGROUND_GRADIENT_2')}, ${getColor('BACKGROUND_GRADIENT_3')}, ${getColor('BACKGROUND_GRADIENT_4')}, ${getColor('BACKGROUND_GRADIENT_5')})`};
`

export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<ThemeType>('light')

    useEffect(() => {
        if (squareRef.current) {
            squareRef.current.scrollTop = squareRef.current.scrollHeight
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            {mode && (
                <Container mode={mode}>
                    <ModeSwitch
                        onChange={(type) => setMode(type as ThemeType)}
                    />
                    <Square ref={squareRef}>
                        <ChatStyled>
                            <MessageList />
                        </ChatStyled>
                        <TextInput />
                    </Square>
                </Container>
            )}
        </ThemeProvider>
    )
}

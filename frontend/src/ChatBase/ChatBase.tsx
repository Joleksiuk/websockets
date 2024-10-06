import React, { useEffect, useRef } from 'react'
import { Container, Square } from './ChatBase.styled'
import { ThemeProvider } from '@mui/material'
import { theme } from '../Theme'
import MessageList from '../Messages/MessageList'

const color = 'primary'
export default function ChatBase(): JSX.Element {
    const squareRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (squareRef.current) {
            squareRef.current.scrollTop = squareRef.current.scrollHeight
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Square ref={squareRef}>
                    <MessageList />
                </Square>
            </Container>
        </ThemeProvider>
    )
}

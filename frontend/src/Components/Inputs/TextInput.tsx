import React, { useState } from 'react'

import {
    FilledInput,
    IconButton,
    InputAdornment,
    ThemeProvider,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { theme } from './TextInput.styled'
import { useAuthContext } from '../../Providers/AuthProvider'
import { useChatContext } from '../../Providers/MessagesProvider'
import { useModeContext } from '../../Providers/ModeProvider'

export default function TextInput() {
    const [text, setText] = useState('')

    const { addMessage } = useChatContext()
    const { mode } = useModeContext()
    const { user } = useAuthContext()

    const sendMessage = () => {
        if (text.trim() !== '' && user !== null) {
            const message = {
                id: new Date().getTime(),
                sender: user,
                content: text,
            }
            addMessage(message)
            setText('')
        }
    }

    const handleClickSend = () => {
        sendMessage()
    }

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            sendMessage()
        }
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    const handleMouseUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    return (
        <ThemeProvider theme={theme(mode)}>
            <FilledInput
                value={text}
                onChange={(text) => setText(text.target.value)}
                defaultValue="Write you message here"
                onKeyDown={handleKeyDown}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickSend}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </ThemeProvider>
    )
}

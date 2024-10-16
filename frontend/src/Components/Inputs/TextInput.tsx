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
import { useModeContext } from '../../Providers/ModeProvider'
import { useChatroomContext } from '../../Providers/ChatroomProvider'

export default function TextInput() {
    const [text, setText] = useState('')

    const { sendMessage } = useChatroomContext()
    const { mode } = useModeContext()
    const { user } = useAuthContext()

    const handleSendMessage = () => {
        if (text.trim() !== '' && user !== null) {
            sendMessage(text, user)
            setText('')
        }
    }

    const handleClickSend = () => {
        handleSendMessage()
    }

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSendMessage()
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

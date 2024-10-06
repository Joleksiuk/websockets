import { TextField } from '@mui/material'
import React from 'react'
import { useAuthContext } from '../Service/AuthProvider'

export default function UsernameInput() {
    const [username, setUsername] = React.useState('')
    const { login } = useAuthContext()

    const handleUsernameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setUsername(event.target.value)
        if (event.target.value.trim() !== '') {
            login(event.target.value)
        }
    }

    return (
        <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={username}
            onChange={handleUsernameChange}
        />
    )
}

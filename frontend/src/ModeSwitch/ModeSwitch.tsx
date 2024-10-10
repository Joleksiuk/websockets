import { useState } from 'react'
import { MaterialUISwitch } from './ModeSwitch.styled'
import { useModeContext } from '../Providers/ModeProvider'

export default function ModeSwitch() {
    const [checked, setChecked] = useState(true)

    const { setMode } = useModeContext()

    const handleModeChange = (value: any) => {
        const isChecked = value.target.checked
        const mode = isChecked ? 'dark' : 'light'
        setChecked(isChecked)
        setMode(mode)
    }

    return (
        <MaterialUISwitch
            value={checked}
            checked={checked}
            onChange={(value) => handleModeChange(value)}
            sx={{ m: 1 }}
        />
    )
}

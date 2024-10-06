import { useState } from 'react'
import { setColorTheme } from '../Colors'
import { MaterialUISwitch } from './ModeSwitch.styled'

type Props = {
    onChange: (mode: string) => void
}

export default function ModeSwitch({ onChange }: Props) {
    const [checked, setChecked] = useState(true)

    const handleModeChange = (value: any) => {
        const isChecked = value.target.checked
        const mode = isChecked ? 'dark' : 'light'
        setChecked(isChecked)
        setColorTheme(mode)
        onChange(mode)
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

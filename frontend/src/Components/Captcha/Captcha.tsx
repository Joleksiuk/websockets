import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { BACKEND_URL, CAPTCHA_KEY } from '../../config'
import { Button, Typography } from '@mui/material'
import { useAuthContext } from '../../Providers/AuthProvider'
import { CaptchaWrapperStyled } from './Captcha.styled'
import { getColorInMode } from '../../Colors'
import { useModeContext } from '../../Providers/ModeProvider'

export default function CaptchaComponent() {
    const { setPassedCaptcha } = useAuthContext()
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const { mode } = useModeContext()
    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token)
        console.log('CAPTCHA token:', token)
    }

    console.log('CAPTCHA key:', CAPTCHA_KEY)
    const handleSubmit = async () => {
        if (!captchaToken) {
            alert('Please complete the CAPTCHA')
            return
        }

        try {
            await fetch(`${BACKEND_URL}/captcha/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: captchaToken }),
            })
            setPassedCaptcha(true)
        } catch (error) {
            console.error('Error verifying CAPTCHA:', error)
        }
    }

    return (
        <CaptchaWrapperStyled>
            <Typography color={getColorInMode('TEXT', mode)} variant="h5">
                Proszę potwierdzić, że nie jesteś robotem
            </Typography>
            <ReCAPTCHA sitekey={CAPTCHA_KEY} onChange={handleCaptchaChange} />
            <Button variant="outlined" type="button" onClick={handleSubmit}>
                Potwierdź
            </Button>
        </CaptchaWrapperStyled>
    )
}

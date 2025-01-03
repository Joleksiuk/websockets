export const USE_SSL = true
export const BACKEND_PORT = '8082'
export const HOST_PERFIX = 'localhost'

export const BACKEND_HOST_NAME =
    process.env.REACT_APP_BACKEND_HOSTNAME || `${HOST_PERFIX}:${BACKEND_PORT}`

export const PROTOCOLE = USE_SSL ? 'https' : 'http'
export const BACKEND_URL = `${PROTOCOLE}://${BACKEND_HOST_NAME}`
export const SECURE_BACKEND_URL = `${PROTOCOLE}://${BACKEND_HOST_NAME}/secure`

export const JWT_EXPIRATION = '1d'
export const JWT_REFRESH_EXPIRATION = '7d'

export const CAPTCHA_KEY =
    process.env.CAPTCHA_KEY || '6LfqNq0qAAAAAKSX3m9L3-vbyMoFHbLtr74H7dHY'

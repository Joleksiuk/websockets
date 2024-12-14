export const USE_SSL = true
export const HOST_NAME = process.env.HOSTNAME || 'localhost'
export const BACKEND_PORT = '3000'
export const PROTOCOLE = USE_SSL ? 'https' : 'http'
export const BACKEND_URL = `${PROTOCOLE}://${HOST_NAME}:${BACKEND_PORT}`
export const SECURE_BACKEND_URL = `${PROTOCOLE}://${HOST_NAME}:${BACKEND_PORT}/secure`
export const ORIGIN = `${PROTOCOLE}://${HOST_NAME}:${BACKEND_PORT}`

export const JWT_EXPIRATION = '1d'
export const JWT_REFRESH_EXPIRATION = '7d'

export const USE_SSL = true
export const HOST_NAME = 'localhost'
export const BACKEND_PORT = '8080'
export const PROTOCOLE = USE_SSL ? 'https' : 'http'
export const BACKEND_URL = `${PROTOCOLE}://${HOST_NAME}:${BACKEND_PORT}`

export type AuthForm = 'username' | 'password' | 'email'

export type ValidationError = {
    message: string
    element: AuthForm
}

export class CustomValidationError extends Error {
    element: AuthForm

    constructor(message: string, element: AuthForm) {
        super(message)
        this.name = 'CustomValidationError'
        this.element = element
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

const ValidationService = {
    validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailRegex.test(email)) {
            throw new CustomValidationError(
                'Email does not have the format: something@something.something',
                'email',
            )
        }

        if (email.length > 250) {
            throw new CustomValidationError(
                'Email is longer than 250 characters',
                'email',
            )
        }
    },

    validateUsername(username: string) {
        if (username.trim().length < 6) {
            throw new CustomValidationError(
                'Username must be longer than 5 characters',
                'username',
            )
        }

        if (username.trim().length > 255) {
            throw new CustomValidationError(
                'Username cannot be longer than 255 characters',
                'username',
            )
        }

        if (username.trim().length === 0) {
            throw new CustomValidationError(
                'Username cannot be all spaces',
                'username',
            )
        }
    },

    validatePassword(password: string) {
        if (password.trim().length < 6) {
            throw new CustomValidationError(
                'Password must be longer than 5 characters',
                'password',
            )
        }

        if (password.trim().length > 255) {
            throw new CustomValidationError(
                'Password cannot be longer than 255 characters',
                'password',
            )
        }
    },

    validateRepeatPassword(password: string, repeatPassword: string) {
        this.validatePassword(password)
        if (password !== repeatPassword) {
            throw new CustomValidationError(
                'Passwords do not match',
                'password',
            )
        }
    },
}

export default ValidationService

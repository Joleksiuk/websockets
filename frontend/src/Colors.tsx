export type ThemeType = 'light' | 'dark'

export type ColorsType = {
    light: { [key: string]: string }
    dark: { [key: string]: string }
}

const colors: ColorsType = {
    light: {
        TEXT: '#565672',
        HEADER_TEXT: '#385566',
        FIRST_BACKGROUND: '#d1bbe7',

        SCROLL_BACKGROUND: '#f5cef4af',
        SCROLL_BAR: '#f5cef4af',
        SCROLL_BAR_BORDER: '#c4a9dfaf',
        SCROLL_BAR_HOVER: '#e7a9e5b0',
        BACKGROUND_GRADIENT_1: '#537597',
        BACKGROUND_GRADIENT_2: '#D9ECFF',
        BACKGROUND_GRADIENT_3: '#FFE3E3',
        BACKGROUND_GRADIENT_4: '#D9ECFF',
        BACKGROUND_GRADIENT_5: '#537597',
        CHAT_SHADOW:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
        CHAT_MESSAGE_BACKGROUND_1: '#5c5ed1cf',
        CHAT_MESSAGE_BACKGROUND_2: '#6aa0f1',
        CHAT_MESSAGE_TEXT_1: '#f2eef5',
        CHAT_MESSAGE_TEXT_2: '#ffffff',
        CHAT_BACKGROUND: '#F5EBFF',

        TEXT_INPUT_BACKGORUND: '#efddffd6',
        TEXT_INPUT_BORDER: '#c5bfca',
        TEXT_INPUT_BORDER_HOVER: '#6f6f70',
        TEXT_INPUT_BORDER_FOCUS: '#2e2e2e6d',
        TEXT_INPUT_BACKGROUND_FOCUS: '#f5ebff',

        USERNAME_INPUT_BACKGROUND: '#f0f4f8',
        USERNAME_INPUT_BORDER: '#a6aebf',
        USERNAME_INPUT_BORDER_HOVER: '#3d5afe',
        USERNAME_INPUT_BORDER_FOCUS: '#2979ff80',
        USERNAME_INPUT_BACKGROUND_FOCUS: '#e3f2fd33',
        SIDEBAR_BACKGROUND: '#61a4da2b',
    },
    dark: {
        TEXT: '#f6f6fca7',
        HEADER_TEXT: '#0e2836',
        FIRST_BACKGROUND: '#6d7ea848',

        SCROLL_BACKGROUND: '#3a2d3eaf',
        SCROLL_BAR: '#5c4565af',
        SCROLL_BAR_BORDER: '#493750ae',
        SCROLL_BAR_HOVER: '#7a6287b0',
        BACKGROUND_GRADIENT_1: '#141e29',
        BACKGROUND_GRADIENT_2: '#2c3b4b',
        BACKGROUND_GRADIENT_3: '#516066',
        BACKGROUND_GRADIENT_4: '#2c3b4b',
        BACKGROUND_GRADIENT_5: '#141e29',
        CHAT_SHADOW:
            'rgba(0, 0, 0, 0.5) 0px 50px 100px -20px, rgba(0, 0, 0, 0.6) 0px 30px 60px -30px, rgba(20, 20, 20, 0.4) 0px -2px 6px 0px inset',
        CHAT_MESSAGE_BACKGROUND_1: '#2a2b5f84',
        CHAT_MESSAGE_BACKGROUND_2: '#3c5b77b9',
        CHAT_MESSAGE_TEXT_1: '#d0cce0da',
        CHAT_MESSAGE_TEXT_2: '#eaeaead6',
        CHAT_BACKGROUND: '#21212cd1',
        TEXT_INPUT_BACKGORUND: '#3b2a4fd6',
        TEXT_INPUT_BORDER: '#b8b5bb',
        TEXT_INPUT_BORDER_HOVER: '#cac6cf',
        TEXT_INPUT_BORDER_FOCUS: '#6e6c70d5',
        TEXT_INPUT_BACKGROUND_FOCUS: '#3a22531c',

        USERNAME_INPUT_BACKGROUND: '#1c1f2649',
        USERNAME_INPUT_BORDER: '#5f6368',
        USERNAME_INPUT_BORDER_HOVER: '#64b5f6',
        USERNAME_INPUT_BORDER_FOCUS: '#90caf980',
        USERNAME_INPUT_BACKGROUND_FOCUS: '#28334733',
        SIDEBAR_BACKGROUND: '#21212c39',
    },
}

export function getColorInMode(variableName: string, mode: ThemeType): string {
    return colors[mode][variableName]
}

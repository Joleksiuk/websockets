import React, { createContext, useContext, useState } from 'react'
import { Alert, IconButton, Snackbar, ThemeProvider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useModeContext } from '../Providers/ModeProvider'
import { theme } from '../Pages/StartPage.styled'

export type SnackBarProps = {
    severity: 'success' | 'error' | 'warning' | 'info'
    message: string
}

type SnackbarContextType = {
    addMessage: (message: string, severity?: SnackBarProps['severity']) => void
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
    undefined,
)

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { mode } = useModeContext()
    const [snackbars, setSnackbars] = useState<
        (SnackBarProps & { id: number })[]
    >([])

    const addMessage = (
        message: string,
        severity: SnackBarProps['severity'] = 'success',
    ) => {
        //setSnackbars((prev) => [...prev, { id: Date.now(), message, severity }])
    }

    const handleClose =
        (id: number) =>
        (event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return
            }
            setSnackbars((prev) =>
                prev.filter((snackbar) => snackbar.id !== id),
            )
        }

    return (
        <SnackbarContext.Provider value={{ addMessage }}>
            <ThemeProvider theme={theme(mode)}>
                {children}
                {snackbars.map((snackbar, index) => (
                    <Snackbar
                        key={snackbar.id}
                        open
                        autoHideDuration={6000}
                        onClose={handleClose(snackbar.id)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        style={{ bottom: 20 + index * 60 }}
                    >
                        <Alert
                            onClose={handleClose(snackbar.id)}
                            severity={snackbar.severity}
                            variant="filled"
                            sx={{ width: '100%' }}
                            action={
                                <IconButton
                                    size="small"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={handleClose(snackbar.id)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            }
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                ))}
            </ThemeProvider>
        </SnackbarContext.Provider>
    )
}

// Custom hook to use the Snackbar context
export const useSnackbar = () => {
    const context = useContext(SnackbarContext)
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider')
    }
    return context
}

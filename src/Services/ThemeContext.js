import React, { useEffect, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ColorModeContext = React.createContext();

export default function ThemeContext(props) {

    const [mode, setMode] = React.useState('light');
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    useEffect(() => {
        if (darkThemeMq.matches) {
            setMode('dark')
        } else {
            setMode('light')
        }
    }, [])

    return (
        <ColorModeContext.Provider value={toggleColorMode}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
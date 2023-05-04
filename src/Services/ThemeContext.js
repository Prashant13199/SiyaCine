import * as React from 'react';
import { createTheme } from '@mui/material/styles';

export default function ThemeContext(props) {
    const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

    const [mode, setMode] = React.useState < 'light' | 'dark' > ('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            {props.children}
        </ColorModeContext.Provider>
    );
}
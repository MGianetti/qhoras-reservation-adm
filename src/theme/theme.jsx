import { createTheme } from '@mui/material';

export const qHorasTheme = createTheme({
    shadows: [
        '0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)',
        '0px 1px 8px #42424257, 0px 1px 8px #34343440',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none'
    ],
    palette: {
        primary: {
            main: '#7F369E'
        },
        secondary: {
            main: '#4C0F66'
        },
        background: {
            default: '#F3F5F8'
        },
        transparent: {
            main: '#7f369e42'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: 'none'
                }
            }
        }
    }
});

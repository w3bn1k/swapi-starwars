import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFD700',
            light: '#FFF59D',
            dark: '#F57F17',
        },
        secondary: {
            main: '#00BFFF',
            light: '#40E0D0',
            dark: '#0080FF',
        },
        background: {
            default: '#0A0A0A',
            paper: '#1A1A1A',
        },
        text: {
            primary: '#FFD700',
            secondary: '#C0C0C0',
        },
        error: {
            main: '#FF4444',
        },
        warning: {
            main: '#FFA500',
        },
        info: {
            main: '#00BFFF',
        },
        success: {
            main: '#00FF00',
        },
    },
    typography: {
        fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            textShadow: '0 0 10px #FFD700',
            letterSpacing: '0.1em',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            textShadow: '0 0 8px #FFD700',
            letterSpacing: '0.05em',
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 600,
            textShadow: '0 0 6px #FFD700',
            letterSpacing: '0.05em',
        },
        h4: {
            fontSize: '1.75rem',
            fontWeight: 500,
            textShadow: '0 0 4px #FFD700',
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 500,
            textShadow: '0 0 4px #FFD700',
        },
        h6: {
            fontSize: '1.25rem',
            fontWeight: 500,
            textShadow: '0 0 2px #FFD700',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    background: 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                        boxShadow: '0 4px 16px rgba(255, 215, 0, 0.5)',
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        '& fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.3)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255, 215, 0, 0.6)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#FFD700',
                            boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                        },
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        color: '#FFD700',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        color: '#FFD700',
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 215, 0, 0.3)',
                        },
                    },
                },
            },
        },
    },
});


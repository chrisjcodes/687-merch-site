'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#14b8a6',
    },
    background: {
      default: '#0f0f0f',
      paper: '#141414',
    },
    text: {
      primary: '#eaeaea',
      secondary: '#9b9b9b',
    },
  },
  typography: {
    fontFamily: 'var(--font-epilogue), "Epilogue", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: 'var(--font-anton), "Anton", "Impact", "Arial Black", sans-serif',
      fontWeight: 400,
      textTransform: 'uppercase',
      fontSize: '4rem',
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: 'var(--font-anton), "Anton", "Impact", "Arial Black", sans-serif',
      fontWeight: 400,
      textTransform: 'uppercase',
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: 'var(--font-anton), "Anton", "Impact", "Arial Black", sans-serif',
      fontWeight: 400,
      textTransform: 'uppercase',
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: '1.5rem',
      letterSpacing: '0.025em',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '1.25rem',
      letterSpacing: '0.025em',
    },
    h6: {
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '1rem',
      letterSpacing: '0.05em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-epilogue), "Epilogue", sans-serif',
          textTransform: 'uppercase',
          fontWeight: 600,
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.875rem',
          letterSpacing: '0.5px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#0f9488',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          borderRadius: 12,
          border: '1px solid transparent',
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: '#333',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&.scrolled': {
            backgroundColor: 'rgba(15, 15, 15, 0.95)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f2bf00',
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },
  },
});

export default theme;
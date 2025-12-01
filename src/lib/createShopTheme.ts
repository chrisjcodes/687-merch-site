import { createTheme, Theme } from '@mui/material/styles';

export function createShopTheme(primaryColor: string): Theme {
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: primaryColor,
      },
      background: {
        default: '#0f0f0f',
        paper: '#1a1a1a',
      },
      text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
      },
    },
    typography: {
      fontFamily: 'var(--font-epilogue), "Epilogue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontFamily: 'var(--font-anton), "Anton", sans-serif',
      },
      h2: {
        fontFamily: 'var(--font-anton), "Anton", sans-serif',
      },
      h3: {
        fontFamily: 'var(--font-anton), "Anton", sans-serif',
      },
      h4: {
        fontFamily: 'var(--font-epilogue), "Epilogue", sans-serif',
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
}

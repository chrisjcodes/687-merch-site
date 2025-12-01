import { createTheme, Theme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export function createShopTheme(primaryColor: string, mode: ThemeMode = 'light'): Theme {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      background: {
        default: isLight ? '#ffffff' : '#0f0f0f',
        paper: isLight ? '#f5f5f5' : '#1a1a1a',
      },
      text: {
        primary: isLight ? '#1a1a1a' : '#ffffff',
        secondary: isLight ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
      divider: isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? '#ffffff' : '#0f0f0f',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 4,
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
            borderRadius: 0,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
    },
  });
}

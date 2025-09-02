// theme.ts
import { createTheme, darken, lighten } from '@mui/material/styles';

const plum  = '#732d6a';  // primary
const teal  = '#05cbc5';  // secondary
const acid  = '#f1f42e';  // accent / warning
const pink  = '#e862aa';  // accent-2 / error emphasis
const slate = '#2a364a';  // neutral base

const WHITE = '#ffffff';
const BLACK = '#000000';
// near-black for dark surfaces (reads softer than pure #000 backgrounds)
const INK   = '#0f1115';
const PAPER = WHITE;

declare module '@mui/material/styles' {
  interface Palette {
    accent: {
      main: string;
      contrastText: string;
      subtle: string;
    };
    brand: {
      plum: string;
      teal: string;
      acid: string;
      pink: string;
      slate: string;
    };
    mono: {
      black: string;
      white: string;
      ink: string;   // near black bg
      paper: string; // white bg
    };
  }
  interface PaletteOptions {
    accent?: {
      main?: string;
      contrastText?: string;
      subtle?: string;
    };
    brand?: {
      plum?: string;
      teal?: string;
      acid?: string;
      pink?: string;
      slate?: string;
    };
    mono?: {
      black?: string;
      white?: string;
      ink?: string;
      paper?: string;
    };
  }
}

export const getDesignTokens = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';

  const backgroundDefault = isLight ? PAPER : INK;
  const backgroundPaper   = isLight ? PAPER : darken(INK, 0.12);

  // custom grey ramp centered around your slate
  const grey = {
    50:  '#f8f9fb',
    100: '#eef1f6',
    200: '#d9dee8',
    300: '#c5ccda',
    400: '#9aa3b2',
    500: '#6b7381',
    600: '#4d5563',
    700: slate,        // brand slate
    800: '#1c2533',
    900: '#0b121c',
  };

  return {
    palette: {
      mode,
      // helps MUI compute readable text on colors
      contrastThreshold: 3,
      tonalOffset: 0.15,

      common: { black: BLACK, white: WHITE },
      grey,

      primary: {
        main: plum,
        light: lighten(plum, 0.18),
        dark: darken(plum, 0.2),
        contrastText: WHITE,
      },
      secondary: {
        main: teal,
        light: lighten(teal, 0.15),
        dark: darken(teal, 0.2),
        contrastText: '#0b1b1f',
      },
      warning: {
        main: acid,
        dark: darken(acid, 0.25),
        contrastText: '#111827',
      },
      error: {
        main: pink,
        dark: darken(pink, 0.2),
        contrastText: '#1a1a1a',
      },
      info: {
        main: '#1ca6a1',
        dark: darken('#1ca6a1', 0.2),
        contrastText: '#0b1b1f',
      },
      success: {
        main: '#2dbf7f',
        dark: darken('#2dbf7f', 0.2),
        contrastText: '#0b1b1f',
      },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },
      text: {
        // prefer deep neutral for body copy, keep slate for brand flavor elsewhere
        primary: isLight ? '#111318' : '#E6EAF2',
        secondary: isLight ? '#4b5566' : '#B8C0CF',
      },
      divider: isLight ? lighten(slate, 0.7) : '#1b2331',

      accent: {
        main: acid,
        contrastText: '#111827',
        subtle: isLight ? '#fffcdc' : '#3a3a11',
      },
      brand: { plum, teal, acid, pink, slate },
      mono:  { black: BLACK, white: WHITE, ink: INK, paper: PAPER },
    },

    typography: {
      fontFamily: [
        'Inter','ui-sans-serif','system-ui','-apple-system',
        'Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans',
        'Apple Color Emoji','Segoe UI Emoji'
      ].join(','),
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },

    shape: { borderRadius: 14 },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': { colorScheme: mode },
          body: { backgroundColor: backgroundDefault },
          '::selection': { background: acid, color: '#111827' },
        },
      },

      // Handy "on-black" and "on-white" button looks you can call with variant="contained"
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 18 },
          containedPrimary: {
            backgroundImage: `linear-gradient(180deg, ${lighten(plum, 0.08)}, ${plum})`,
            color: WHITE,
            '&:hover': {
              backgroundImage: `linear-gradient(180deg, ${lighten(plum, 0.05)}, ${darken(plum, 0.05)})`,
            },
            '&:disabled': {
              backgroundImage: 'none',
              backgroundColor: isLight ? grey[300] : grey[700],
              color: isLight ? grey[500] : grey[400],
              opacity: 0.7,
            },
          },
          outlined: {
            borderColor: isLight ? grey[200] : grey[800],
          },
        },
        variants: [
          // on-black (use sx={{ variant: 'onBlack' }} via data-attr)
          {
            // usage: <Button variant="contained" data-variant="onBlack">
            props: { variant: 'contained', 'data-variant': 'onBlack' as any },
            style: {
              backgroundColor: BLACK,
              color: WHITE,
              border: `1px solid ${grey[800]}`,
              '&:hover': { backgroundColor: '#111' },
            },
          },
          // on-white (strong black ink)
          {
            // usage: <Button variant="contained" data-variant="onWhite">
            props: { variant: 'contained', 'data-variant': 'onWhite' as any },
            style: {
              backgroundColor: WHITE,
              color: BLACK,
              border: `1px solid ${grey[200]}`,
              '&:hover': { backgroundColor: '#f7f7f7' },
            },
          },
          // soft secondary stays for brand teal on neutral surfaces
          {
            props: { variant: 'soft' as any },
            style: {
              backgroundColor: isLight ? '#eafdfc' : '#0d2221',
              color: teal,
              border: `1px solid ${isLight ? lighten(teal, 0.6) : darken(teal, 0.6)}`,
            },
          },
        ],
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? slate : INK,
            color: WHITE,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isLight ? grey[200] : '#1b2331'}`,
            backgroundImage: 'none',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          colorPrimary: { backgroundColor: plum, color: WHITE },
          colorSecondary: { backgroundColor: lighten(teal, 0.45), color: darken(teal, 0.4) },
          colorWarning: { 
            backgroundColor: isLight ? lighten(acid, 0.3) : darken(acid, 0.6), 
            color: isLight ? darken(acid, 0.4) : acid,
            border: `1px solid ${isLight ? darken(acid, 0.2) : darken(acid, 0.3)}`,
          },
          colorSuccess: { 
            backgroundColor: isLight ? '#e8f5f0' : '#0d2818', 
            color: isLight ? '#2dbf7f' : '#4ade80',
            border: `1px solid ${isLight ? '#2dbf7f' : '#16a34a'}`,
          },
          colorDefault: {
            backgroundColor: isLight ? grey[100] : grey[800],
            color: isLight ? grey[700] : grey[300],
            border: `1px solid ${isLight ? grey[300] : grey[600]}`,
          },
        },
        variants: [
          // on-black chip for dark hero sections
          {
            props: { variant: 'filled', color: 'default' },
            style: {
              backgroundColor: BLACK,
              color: WHITE,
              border: `1px solid ${grey[800]}`,
            },
          },
        ],
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? grey[200] : grey[800] },
        },
      },

      MuiLink: {
        styleOverrides: {
          root: { color: teal, '&:hover': { color: darken(teal, 0.15) } },
        },
      },

      MuiAlert: {
        styleOverrides: {
          standardWarning: {
            backgroundColor: isLight ? '#fffcdc' : '#2c2c0e',
            color: '#363500',
            border: `1px solid ${darken(acid, 0.2)}`,
          },
          standardError: {
            backgroundColor: isLight ? lighten(pink, 0.48) : '#2a0e1f',
            color: isLight ? darken(pink, 0.5) : '#ffd7ea',
          },
        },
      },
    },
  } as const;
};

export const makeTheme = (mode: 'light' | 'dark' = 'light') =>
  createTheme(getDesignTokens(mode));

// Export default light theme
const theme = makeTheme('light');
export default theme;
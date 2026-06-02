import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0e4fc1',
      light: '#6ea8ff',
      dark: '#0a2f6f',
    },
    secondary: {
      main: '#4f83ff',
      light: '#a3c4ff',
      dark: '#1d3f8f',
    },
    background: {
      default: '#eff5ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#12254a',
      secondary: '#4f6c9f',
    },
  },
  typography: {
    fontFamily: "'Lucida Bright', 'Times New Roman', serif",
    h1: { fontSize: '2.5rem', fontWeight: 700, fontFamily: "'Bodoni MT Black', serif" },
    h2: { fontSize: '2rem', fontWeight: 700, fontFamily: "'Bodoni MT Black', serif" },
    h3: { fontSize: '1.75rem', fontWeight: 700, fontFamily: "'Bodoni MT Black', serif" },
    h4: { fontSize: '1.25rem', fontWeight: 600, fontFamily: "'Bodoni MT Black', serif" },
    h5: { fontSize: '1.1rem', fontWeight: 600, fontFamily: "'Bodoni MT Black', serif" },
    h6: { fontSize: '1rem', fontWeight: 600, fontFamily: "'Bodoni MT Black', serif" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '999px',
          fontWeight: 600,
          transition: 'all 0.24s ease',
        },
        contained: {
          boxShadow: '0 16px 28px rgba(25, 118, 210, 0.18)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid rgba(25, 118, 210, 0.15)',
          boxShadow: '0 22px 48px rgba(8, 37, 87, 0.09)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
  },
});

export default theme;

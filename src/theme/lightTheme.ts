import { createTheme, responsiveFontSizes } from "@mui/material";

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    ss: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    sl: true;
  }
  interface Palette {
    neutral: {
      main: string, // 1 line
      paper: string, // 3 lines
      contrast: string, //1 star
      grey: string, // 2 starts
      bright: string, // 3 stars
      common: string,
      border: string
    }
  }
  interface PaletteOptions {
    neutral?: {
      main: string, // 1 line
      paper: string, // 3 lines
      contrast: string, //1 star
      grey: string, // 2 starts
      bright: string, // 3 stars
      common: string,
      border: string
    }
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      ss: 360,
      xs: 481,
      sm: 769,
      md: 1025,
      lg: 1367,
      xl: 1601,
      sl: 1801
    }
  },
  components: {

  },
  typography: {
    fontSize: 16,
    h3: {
      fontWeight: 900
    },
    h5: {
      fontFamily: `Coolvetica;`,
      lineHeight: 1
    },
    h6: {
      fontSize: `1rem`,
      fontFamily: `Coolvetica;`,
      lineHeight: 1
    },
    subtitle1: {
      fontSize: `0.825rem`,
      lineHeight: 1
    },
    subtitle2: {
      fontSize: `0.75rem`,
      lineHeight: 1
    },
    body1: {
      fontFamily: `Myriad Pro;`,
      lineHeight: 1
    },
    body2: {
      fontFamily: `Myriad Pro;`,
      lineHeight: 1
    }
  },
  palette: {
    text: {
      primary: `#326ABD`, // 2 lines
    },
    background: {
      default: `#9AC3E2`, //back
      paper: `#FFFFFF` // menu back
    },
    neutral: {
      main: '#9AC3E2', // 1 line
      paper: `#326ABD`, // 3 lines
      contrast: `#FFFFFF`, //1 star
      grey: `#9AC3E2`, // 2 starts
      bright: `#11020D`, // 3 stars
      common: `#FFFFFF`,
      border: `#326ABD` // 5 stars
    },
  },
});

const lightTheme = responsiveFontSizes(theme, { factor: 3 });
export default lightTheme;

import { createTheme } from "@mui/material/styles";

import type {} from "@mui/lab/themeAugmentation";

import type { ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    navItemBg: {
      active: string;
      inactive?: string;
      hover: string;
    };
  }
  interface ThemeOptions {
    navItemBg?: {
      active?: string;
      inactive?: string;
      hover?: string;
    };
  }
}

export const themeOptions: ThemeOptions = {
  navItemBg: {
    active: "rgba(255, 255, 255, 0.04)",
    hover: "rgba(255, 255, 255, 0.04)",
  },
  components: {
    MuiInputBase: {
      defaultProps: {
        sx: {
          fontSize: "1rem",
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: "1rem",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          paddingTop: "0",
          paddingBottom: "0",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "1rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "&:disabled": {
            backgroundColor: "#E3EAFF",
          },
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#4a77e5",
    },
    secondary: {
      main: "#a042ed",
      light: "#c596f6",
      dark: "rgba(90,0,216,0.58)",
    },
    text: {
      primary: "#1f2a4b",
      secondary: "#9ea3b2",
    },
    background: {
      paper: "#ffffff",
      default: "#f6f7f8",
    },
    success: {
      main: "#94f03d",
      dark: "#29b100",
    },
    warning: {
      main: "#f0993d",
      dark: "#dc7332",
    },
    info: {
      main: "#403df0",
      dark: "#002cda",
      light: "#cfc6fa",
    },
  },
  typography: {
    fontFamily: ["mark pro", "Montserrat", "sans-serif"].join(","),
    fontSize: 16,
  },
};

// Create a theme instance.
const theme = createTheme(themeOptions);

export default theme;

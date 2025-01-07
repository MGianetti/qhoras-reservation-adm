import { createTheme } from "@mui/material";

export const qHorasTheme = createTheme({
  shadows: [
    "0px 1px 8px rgb(154 154 154 / 9%), 0px 1px 8px rgb(124 124 124 / 6%)",
    "0px 1px 8px #42424257, 0px 1px 8px #34343440",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  palette: {
    primary: {
      main: "#1976D2", // Vibrant blue for primary buttons and highlights
      light: "#63A4FF", // Lighter shade for hover effects
      dark: "#004BA0", // Darker shade for contrast elements
    },
    secondary: {
      main: "#1565C0", // Deep blue for secondary buttons or accents
      light: "#5E92F3", // Lighter blue for secondary hover effects
      dark: "#003C8F", // Dark accent shade
    },
    background: {
      default: "#E3F2FD", // Soft blue-tinted white for backgrounds
      paper: "#FFFFFF", // Pure white for cards and modals
    },
    text: {
      primary: "#0D47A1", // Dark blue for main text
      secondary: "#5472D3", // Muted blue for secondary text
      disabled: "#9E9E9E", // Gray for disabled text
    },
    transparent: {
      main: "#1976D242", // Semi-transparent blue for overlays or subtle highlights
    },
    error: {
      main: "#D32F2F", // Red for error messages
    },
    warning: {
      main: "#FFA000", // Amber for warnings
    },
    info: {
      main: "#0288D1", // Light blue for informational messages
    },
    success: {
      main: "#388E3C", // Green for success messages
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
  },
});

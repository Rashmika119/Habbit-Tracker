export const lightTheme = {
  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F5F7FA",
    tertiary: "rgba(165, 192, 237, 0.1)",
    card: "#FFFFFF",
    overlay: "rgba(4, 97, 98, 0.3)",
  },

  // Text colors
  text: {
    primary: "#333333",
    secondary: "#666666",
    tertiary: "#999999",
    inverse: "#FFFFFF",
    accent: "#5271FF",
    success: "#4ade80",
    error: "#f87171",
    warning: "#fbbf24",
  },

  // Border colors
  border: {
    primary: "#E5E5E5",
    secondary: "#EEEEEE",
    accent: "#5271FF",
  },

  // Button colors
  button: {
    primary: "#5271FF",
    secondary: "#FFFFFF",
    success: "#4ade80",
    error: "#f87171",
  },

  // Shadow colors
  shadow: {
    primary: "#000000",
  },
}

export const darkTheme = {
  // Background colors
  background: {
    primary: "#1a1a1a",
    secondary: "#2a2a2a",
    tertiary: "#0f0f0f",
    card: "#2a2a2a",
    overlay: "rgba(4, 97, 98, 0.5)",
  },

  // Text colors
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC",
    tertiary: "#999999",
    inverse: "#000000",
    accent: "#6366f1",
    success: "#4ade80",
    error: "#f87171",
    warning: "#fbbf24",
  },

  // Border colors
  border: {
    primary: "#404040",
    secondary: "#333333",
    accent: "#6366f1",
  },

  // Button colors
  button: {
    primary: "#6366f1",
    secondary: "#2a2a2a",
    success: "#4ade80",
    error: "#f87171",
  },

  // Shadow colors
  shadow: {
    primary: "#000000",
  },
}

export type Theme = typeof lightTheme

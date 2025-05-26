export type ThemeType = {
  isDarkMode: boolean;
  setTheme: (isDark: boolean) => void;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}
export type ThemeColors = {
  background: {
    primary: string
    secondary: string
    tertiary: string
    card: string
    overlay: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
    accent: string
    success: string
    error: string
    warning: string
  }
  border: {
    primary: string
    secondary: string
    accent: string
  }
  button: {
    primary: string
    secondary: string
    success: string
    error: string
  }
  shadow: {
    primary: string
  }
}
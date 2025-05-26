
import { useThemeStore } from "../Store/themeStore"
import { darkTheme, lightTheme, Theme } from "../Themes/colors"


export const useTheme = () => {
  const { isDarkMode, setTheme, loadTheme, toggleTheme } = useThemeStore()

  const theme: Theme = isDarkMode ? darkTheme : lightTheme

  return {
    theme,
    isDarkMode,
    setTheme,
    loadTheme,
    toggleTheme,
  }
}

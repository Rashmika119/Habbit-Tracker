import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ThemeType } from "../Types/themeType"


export const useThemeStore = create<ThemeType>((set, get) => ({
  isDarkMode: false,

  setTheme: (isDark:boolean) => {
    set({ isDarkMode: isDark })
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        set({ isDarkMode: savedTheme === "dark" })
      }
    } catch (error) {
      console.log("Error loading theme:", error)
    }
  },

  toggleTheme: async () => {
    const { isDarkMode } = get()
    const newTheme = !isDarkMode
    set({ isDarkMode: newTheme })
    try {
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.log("Error saving theme:", error)
    }
  },
}))
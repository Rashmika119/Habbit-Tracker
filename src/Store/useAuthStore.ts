import { create } from "zustand";
import { UserType } from "../Types/userTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

// use auth store to store currently loggedin user,not logout users
type AuthStore = {
  currentUser: UserType | null;
  setCurrentUser: (user: UserType) => void;
  clearCurrentUser: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: async () => {
    await AsyncStorage.removeItem("logged-in-user")
    set({ currentUser: null })
  },
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));



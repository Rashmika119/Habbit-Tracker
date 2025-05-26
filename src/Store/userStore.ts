import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Keyboard } from "react-native";
import { create } from "zustand"
import { userInputType, userStoreType, userTextType, UserType } from "../Types/userTypes";
import { use } from "react";
import { useAuthStore } from "./useAuthStore";

export const useUserTextStore = create<userTextType>((set) => ({
  userText: {
    id: 0,
    username: "",
    email: "",
    password: "",

  },
  setUserText: (value: string, key: keyof UserType) => {
    set((state) => ({
      userText: {
        ...state.userText,
        [key]: value,
      }
    }));
  },
  clearUserText: () => {
    set(() => ({
      userText: {
        id: 0,
        username: "",
        email: "",
        password: "",
      }
    }))
  }
}))

export const useUserStore = create<userStoreType>((set) => ({
  users: [],

  signUpUser: async () => {
    const { userText, clearUserText } = useUserTextStore.getState();
    try {
      if (!userText.username.trim() || !userText.email.trim() || !userText.password.trim()) {
        Alert.alert("Please fill all the fields");
        return;
      }

      const existingUsersString = await AsyncStorage.getItem("my-user");
      const existingUsers: UserType[] = existingUsersString ? JSON.parse(existingUsersString) as UserType[] : [];

      const isUserExists = existingUsers.some((user: any) => user.email === userText.email);

      if (isUserExists) {
        Alert.alert("User already exists");
        return;
      }

      const newUser = {
        id: Math.random(),
        username: userText.username,
        email: userText.email,
        password: userText.password,
      };

      const updatedUsers = [...existingUsers, newUser];
      await AsyncStorage.setItem("my-user", JSON.stringify(updatedUsers));
      await AsyncStorage.setItem("logged-in-user", JSON.stringify(newUser));

      await AsyncStorage.setItem(`my-habit-${newUser.id}`, JSON.stringify([]));
      await AsyncStorage.setItem(`progress-${newUser.id}`, JSON.stringify([]));
      await AsyncStorage.setItem(`lastRasetDate-${newUser.id}`, JSON.stringify([]));

      set({ users: updatedUsers });
      useAuthStore.getState().setCurrentUser(newUser);
      useAuthStore.getState().setIsLoggedIn(true);

      clearUserText();
      Keyboard.dismiss();
      Alert.alert("User registered successfully!");
    } catch (error) {
      console.log("Registration error:", error);
    }
  },

  signInUser: async (userData: userInputType) => {
    const { clearUserText } = useUserTextStore.getState();

    try {
      const existingUsersString = await AsyncStorage.getItem("my-user");
      const existingUsers = existingUsersString ? JSON.parse(existingUsersString) : [];

      const loggedInUser = existingUsers.find(
        (user: any) => user.username === userData.username && user.password === userData.password
      );

      if (!loggedInUser) {
        Alert.alert("Invalid username or password");
        return;
      }

      await AsyncStorage.setItem("logged-in-user", JSON.stringify(loggedInUser));
      useAuthStore.getState().setCurrentUser(loggedInUser);
      useAuthStore.getState().setIsLoggedIn(true);

      Alert.alert("User logged in successfully!");
      clearUserText();
      Keyboard.dismiss();
    } catch (error) {
      console.log("Login error:", error);
    }
  },

  logoutUser: async () => {
    const { clearUserText } = useUserTextStore.getState();
    try {
      clearUserText();
      await AsyncStorage.removeItem("logged-in-user");
      useAuthStore.getState().clearCurrentUser();
      Keyboard.dismiss();
      console.log("✅ Logout successful");
    } catch (error) {
      console.log("Logout error:", error);
    }
  },

  setHabits: (users: UserType[]) => {
    set({ users });
  },
}));


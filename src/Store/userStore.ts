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

  signUpUser: async (navigation: any) => {
    const { userText, clearUserText } = useUserTextStore.getState();
    try {
      if (!userText.username.trim() || !userText.email.trim() || !userText.password.trim()) {
        Alert.alert("Please fill all the fields");
        return;
      }

      const existingUsersString = await AsyncStorage.getItem("my-user");
      const existingUsers = existingUsersString ? JSON.parse(existingUsersString) : [];

      const isUserExists = existingUsers.some((user: any) => user.email === userText.email);

      if (isUserExists) {
        Alert.alert("User already exists");
        return;
      } else {
        const newUser = {
          id: Math.random(),
          username: userText.username,
          email: userText.email,
          password: userText.password,
        };

        const updatedUsers = [...existingUsers, newUser];
        await AsyncStorage.setItem("my-user", JSON.stringify(updatedUsers));

        // Save logged-in user for auto login
        await AsyncStorage.setItem("logged-in-user", JSON.stringify(newUser));

        //  Clear user-specific data (habits, progress, calendar)
        await AsyncStorage.setItem(`my-habit-${newUser.id}`, JSON.stringify([]));
        await AsyncStorage.setItem(`progress-${newUser.id}`, JSON.stringify([]));
        await AsyncStorage.setItem(`lastRasetDate-${newUser.id}`, JSON.stringify([]));



        set({ users: updatedUsers });
        Alert.alert("User Added Successfully");
        navigation.navigate("Home");

        clearUserText();
        Keyboard.dismiss();
      }
    } catch (error) {
      console.log(error);
    }
  },

  signInUser: async (navigation: any,userData:userInputType) => {
    const { userText, clearUserText } = useUserTextStore.getState();

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

      //store user data for auto login
      await AsyncStorage.setItem("logged-in-user", JSON.stringify(loggedInUser));
      //await loadUserData(loggedInUser)

      //set current user in auth store
      useAuthStore.getState().setCurrentUser(loggedInUser);

      Alert.alert("User logged in Successfully");
      clearUserText();
      Keyboard.dismiss();
      navigation.navigate("Home");

    } catch (error) {
      console.log(error);
    }
  },

  logoutUser: async (navigation: any) => {
    const { clearUserText } = useUserTextStore.getState();
    try {
      clearUserText();
      await AsyncStorage.removeItem("logged-in-user");

      //Clear current user in auth store
      useAuthStore.getState().clearCurrentUser();

      Keyboard.dismiss();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  },

  setHabits: (users: UserType[]) => {
    set({ users });
  },
}));

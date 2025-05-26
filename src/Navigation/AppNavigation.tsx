import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../Screens/LoginScreen.screen";
import BottomTabs from "./BottomTabs";

import EditScreen from "../Screens/EditScreen.screen";
import RegisterScreen from "../Screens/register.screen";
import ProfileScreen from "../Screens/ProfileScreen.screen";
import OpeningScreen from "../Screens/OpeningScreen.screen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [loading, setLoading] = useState(true);

  const setCurrentUser = useAuthStore((state: any) => state.setCurrentUser);
  const setIsLoggedIn = useAuthStore((state: any) => state.setIsLoggedIn); 
  const isLoggedIn = useAuthStore((state: any) => state.isLoggedIn);


  useEffect(() => {
    const checkUser = async () => {
      const userString = await AsyncStorage.getItem("logged-in-user");
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        setIsLoggedIn(true);
      }
      setLoading(false);
    };
    checkUser();
  }, [isLoggedIn]);

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="loading" component={OpeningScreen} />
      {isLoggedIn ? (
        <>
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="Edit" component={EditScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

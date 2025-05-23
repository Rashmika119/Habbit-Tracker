import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useAuthStore } from "../Store/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../Screens/LoginScreen.screen";
import BottomTabs from "./BottomTabs";
import RegisterScreen from "../Screens/Register.screen";
import EditScreen from "../Screens/EditScreen.screen";


const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setCurrentUser = useAuthStore(state => state.setCurrentUser);

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
  }, []);

  if (loading) return null; // loading screen

return (
  
  //if a user loggedin, then directly navigate to the homescreen
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {isLoggedIn ? (
      <>
        <Stack.Screen name="BottomTabs" component={BottomTabs} />
        <Stack.Screen name="Edit" component={EditScreen} />
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

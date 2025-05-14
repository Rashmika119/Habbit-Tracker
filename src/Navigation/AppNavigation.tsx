import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";

import LoginScreen from "../Screens/LoginScreen.screen";
import RegisterScreen from "../Screens/Register.screen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const isLoggedIn=true; // use real auth logic later
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <>
                <Stack.Screen name="BottomTabs" component={BottomTabs} />
                
                </>
            ):(
                <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}

        </Stack.Navigator>
    );
}



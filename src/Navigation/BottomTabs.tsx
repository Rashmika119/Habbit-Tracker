import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen.screen";
import AddScreen from "../Screens/AddScreen.screen";
import TaskScreen from "../Screens/TaskScreen.screen";

import React from "react";
import { Image, StyleSheet } from "react-native";

// Import your home icon image (adjust the path as needed)
import HomeIcon from '../Assets/home.png';


const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabBar }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={HomeIcon}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: focused ? 'tomato' : 'gray',

                        }}
                    />
                ),
            }} />
            <Tab.Screen name="Add" component={AddScreen} />
            <Tab.Screen name="Tasks" component={TaskScreen} />

        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }

});
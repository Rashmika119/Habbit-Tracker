import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen.screen";
import AddScreen from "../Screens/AddScreen.screen";
import TaskScreen from "../Screens/TaskScreen.screen";

import React from "react";
import { Image, StyleSheet } from "react-native";

// Import your home icon image (adjust the path as needed)
import HomeIcon from '../Assets/home.png';
import AddIcon from '../Assets/add.png';
import TaskIcon from '../Assets/task.png';


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
            <Tab.Screen name="Add" component={AddScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={AddIcon}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: focused ? 'tomato' : 'gray',
                        }}
                    />
                )
            }} />
            <Tab.Screen name="Tasks" component={TaskScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={TaskIcon}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: focused ? 'tomato' : 'gray',
                        }}
                    />
                )
            }} />

        </Tab.Navigator>
    );
}
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

});
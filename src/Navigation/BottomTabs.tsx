import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen.screen";
import AddScreen from "../Screens/AddScreen.screen";
import TaskScreen from "../Screens/TaskScreen.screen";

import React from "react";
import { Image, StyleSheet } from "react-native";
import { useThemeStore } from "../Store/themeStore";


import HomeIcon from '../Assets/home.png';
import AddIcon from '../Assets/add.png';
import TaskIcon from '../Assets/task.png';
import { darkTheme, lightTheme } from "../Themes/colors";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    const { isDarkMode } = useThemeStore();
    const theme = isDarkMode ? darkTheme : lightTheme;
    const styles = createStyles(theme);

    return (
        

        <Tab.Navigator 
            screenOptions={{ 
                headerShown: false, 
                tabBarShowLabel: false, 
                tabBarStyle: styles.tabBar 
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={HomeIcon}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: focused ? theme.button.primary : theme.text.secondary,
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
                            tintColor: focused ? theme.button.primary : theme.text.secondary,
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
                            tintColor: focused ? theme.button.primary : theme.text.secondary,
                        }}
                    />
                )
            }} />
        </Tab.Navigator>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    tabBar: {
        backgroundColor: theme.background.card,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 8,
        shadowColor: theme.shadow.primary,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderTopWidth: 1,
        borderTopColor: theme.border.primary,
    },
});
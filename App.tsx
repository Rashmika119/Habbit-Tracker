/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import AddScreen from './src/Screens/AddScreen.screen';
import AppNavigation from './src/Navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';



function App() {
  

  return (
    <NavigationContainer>
    <AppNavigation/>
    </NavigationContainer>
  )
};

export default App;

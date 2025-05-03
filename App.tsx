/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RegisterScreen from './src/Screens/Register.screen';
import HomeScreen from './src/Screens/HomeScreen.screen';



function App() {
  

  return (
    <>
    <HomeScreen/>
    
    </>
  )
};

export default App;

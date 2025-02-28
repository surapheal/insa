import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen'; // Correct path
import ScannerScreen from './components/ScannerScreen'; // Correct path
import QRCodeGenerator from './components/QRCodeGenerator'; // Correct path
import ScanResultScreen from './components/ScanResultScreen'; // Correct path

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="QRCodeGenerator" component={QRCodeGenerator} />
        <Stack.Screen name="ScanResultScreen" component={ScanResultScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
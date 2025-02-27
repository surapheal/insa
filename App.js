import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ScannerScreen from './components/ScannerScreen';
import QRCodeGenerator from './components/QRCodeGenerator';
import ScanResultScreen from './components/ScanResultScreen'; 
import QRCodeGeneratorIndiv from './components/QRCodeGeneratorIndiv';
import QRScanner from './components/QRScanner';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="QRCodeGenerator" component={QRCodeGenerator} />
        <Stack.Screen name="QRCodeGeneratorIndiv" component={QRCodeGeneratorIndiv} />
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


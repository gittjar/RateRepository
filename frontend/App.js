import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AuthStorageProvider from './contexts/AuthStorageProvider';
import Navbar from './components/Navbar';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthStorageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={Navbar} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthStorageProvider>
  );
};

export default App;
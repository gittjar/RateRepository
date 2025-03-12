import React, { useContext, useEffect, useState } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuthStorageContext from '../contexts/AuthStorageContext';
import HomeScreen from '../screens/HomeScreen';
import RepositoriesScreen from '../screens/RepositoriesScreen';
import TimeScreen from '../screens/TimeScreen';

const Tab = createMaterialTopTabNavigator();

const Navbar = ({ navigation }) => {
  const authStorage = useContext(AuthStorageContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedToken = await authStorage.getAccessToken();
      setIsLoggedIn(!!storedToken);
      setToken(storedToken);
      setLoading(false);
    };

    checkLoginStatus();
  }, [authStorage]);

  const handleLogout = async () => {
    await authStorage.removeAccessToken();
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Tab.Navigator>
      {isLoggedIn && <Tab.Screen name="Home" component={HomeScreen} initialParams={{ token }} />}
      <Tab.Screen name="Repositories" component={RepositoriesScreen} />
      <Tab.Screen name="Time" component={TimeScreen} />
      {isLoggedIn ? (
        <Tab.Screen name="Logout" component={() => (
          <View>

            <Button title="Logout" onPress={handleLogout} />
          </View>
        )} />
      ) : (
        <Tab.Screen name="Login" component={() => {
          navigation.navigate('Login');
          return null;
        }} />
      )}
    </Tab.Navigator>
  );
};



export default Navbar;
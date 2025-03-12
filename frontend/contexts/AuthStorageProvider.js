import React, { useState, useEffect } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthStorageProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        setToken(storedToken);
      }
    };
    loadToken();
  }, []);

  const getAccessToken = async () => {
    return token;
  };

  const saveAccessToken = async (newToken) => {
    await AsyncStorage.setItem('accessToken', newToken);
    setToken(newToken);
  };

  const removeAccessToken = async () => {
    await AsyncStorage.removeItem('accessToken');
    setToken(null);
  };

  return (
    <AuthStorageContext.Provider value={{ getAccessToken, saveAccessToken, removeAccessToken }}>
      {children}
    </AuthStorageContext.Provider>
  );
};

export default AuthStorageProvider;
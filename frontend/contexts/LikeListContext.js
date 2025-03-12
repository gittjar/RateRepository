// Not in use yet, but will be used in the future

import React, { createContext, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../components/Config';

const LikeListContext = createContext();

export const LikeListProvider = ({ children }) => {
  const [likelist, setLikelist] = useState([]);

  const fetchLikelist = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${Config.baseURL}/likelist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikelist(response.data);
    } catch (error) {
      console.error('Failed to fetch likelist', error);
    }
  }, []);

  const addToLikelist = useCallback(async (repositoryId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post(
        `${Config.baseURL}/likelist/${repositoryId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikelist((prevLikelist) => [...prevLikelist, repositoryId]);
      return response.data.message;
    } catch (error) {
      console.error('Failed to add repository to likelist', error);
      throw new Error('Failed to add repository to likelist');
    }
  }, []);

  const removeFromLikelist = useCallback(async (repositoryId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.delete(`${Config.baseURL}/likelist/${repositoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikelist((prevLikelist) => prevLikelist.filter((id) => id !== repositoryId));
      return response.data.message;
    } catch (error) {
      console.error('Failed to remove repository from likelist', error);
      throw new Error('Failed to remove repository from likelist');
    }
  }, []);

  return (
    <LikeListContext.Provider value={{ likelist, fetchLikelist, addToLikelist, removeFromLikelist }}>
      {children}
    </LikeListContext.Provider>
  );
};

export const useLikeList = () => useContext(LikeListContext);
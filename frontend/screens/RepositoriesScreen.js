import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../components/theme';
import Config from '../components/Config';
import Notification from '../components/Notification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFE',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 600,
    padding: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    border: '1px solid black',
    fontFamily: theme.fonts.main,
  },
  separator: {
    height: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    marginLeft: 10,
  },
  counts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  count: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  fullName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const formatCount = (count) => {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count;
};

const RepositoriesScreen = () => {
  const [repositories, setRepositories] = useState([]);
  const [likelist, setLikelist] = useState([]);
  const [notification, setNotification] = useState({ message: '', visible: false });

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

  const fetchRepositories = useCallback(async () => {
    try {
      const response = await axios.get(`${Config.baseURL}/repositories`);
      setRepositories(response.data);
    } catch (error) {
      console.error('Failed to fetch repositories', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLikelist();
      fetchRepositories();
    }, [fetchLikelist, fetchRepositories])
  );

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
      setNotification({ message: response.data.message, visible: true });
    } catch (error) {
      console.error('Failed to add repository to likelist', error);
      Alert.alert('Error', 'Failed to add repository to likelist');
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
      setNotification({ message: response.data.message, visible: true });
    } catch (error) {
      console.error('Failed to remove repository from likelist', error);
      Alert.alert('Error', 'Failed to remove repository from likelist');
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={repositories}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
              <View style={styles.details}>
                <Text style={styles.fullName}>{item.fullName}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.language}>{item.language}</Text>
              </View>
            </View>
            <View style={styles.counts}>
              <Text style={styles.count}>{formatCount(item.forksCount)} Forks</Text>
              <Text style={styles.count}>{formatCount(item.stargazersCount)} Stars</Text>
              <Text style={styles.count}>{formatCount(item.ratingAverage)} Rating</Text>
              <Text style={styles.count}>{formatCount(item.reviewCount)} Reviews</Text>
            </View>
            <View style={styles.button}>
              {likelist.includes(item.id) ? (
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromLikelist(item.id)}>
                  <Text style={styles.deleteButtonText}>Remove from Likelist</Text>
                </TouchableOpacity>
              ) : (
                <Button
                  title="Add to Likelist"
                  onPress={() => addToLikelist(item.id)}
                />
              )}
            </View>
          </View>
        )}
      />
      <Notification
        message={notification.message}
        visible={notification.visible}
        onHide={() => setNotification({ ...notification, visible: false })}
      />
    </View>
  );
};

export default RepositoriesScreen;
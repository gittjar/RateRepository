import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import Config from '../components/Config';
import ConfirmationDialog from '../components/ConfirmationDialog';
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
    maxWidth: 700,
    padding: 15,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  counts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  count: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  language: {
    backgroundColor: '#0366d6',
    color: 'white',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  fullName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#555',
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
  return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
};

const HomeScreen = ({ route }) => {
  const [userData, setUserData] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedRepoName, setSelectedRepoName] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const token = route?.params?.token;

  const fetchUserData = useCallback(async () => {
    try {
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get(`${Config.baseURL}/likelist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${Config.baseURL}/likelist/${selectedRepo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setUserData(prevData => prevData.filter(item => item.id !== selectedRepo));
        setNotificationMessage(`You deleted "${selectedRepoName}" successfully.`);
        setNotificationVisible(true);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item', error);
    } finally {
      setConfirmVisible(false);
      setSelectedRepo(null);
      setSelectedRepoName('');
    }
  };

  const confirmDelete = (repositoryId, repositoryName) => {
    setSelectedRepo(repositoryId);
    setSelectedRepoName(repositoryName);
    setConfirmVisible(true);
  };

  return (
    <View style={styles.container}>
      <Notification
        message={notificationMessage}
        visible={notificationVisible}
        onHide={() => setNotificationVisible(false)}
      />
      <ConfirmationDialog
        visible={confirmVisible}
        message={`Are you sure you want to delete the repository "${selectedRepoName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
      {userData.length > 0 ? (
        <FlatList
          data={userData}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Image style={styles.avatar} source={{ uri: item.ownerAvatarUrl }} />
                <View style={styles.details}>
                  <Text style={styles.fullName}>{item.fullName}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.language}>{item.language}</Text>
                </View>
              </View>
              <View style={styles.counts}>
                <Text style={styles.count}>{formatCount(item.forksCount)} Forks</Text>
                <Text style={styles.count}>{formatCount(item.stargazersCount)} Stars</Text>
                <Text style={styles.count}>{formatCount(item.ratingAverage)} Rating</Text>
                <Text style={styles.count}>{formatCount(item.reviewCount)} Reviews</Text>
              </View>
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id, item.fullName)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default HomeScreen;
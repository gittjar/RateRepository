import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Config from '../components/Config';
import AuthStorageContext from '../contexts/AuthStorageContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const authStorage = useContext(AuthStorageContext);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${Config.baseURL}/login`, { username, password });
      if (response.status === 200 && response.data.accessToken) {
        const { accessToken } = response.data;
        setMessage('Login OK!');
        console.log('Token received:', accessToken); // Log the token
        if (authStorage && authStorage.saveAccessToken) {
          await authStorage.saveAccessToken(accessToken);
          navigation.navigate('Home', { token: accessToken });
        } else {
          console.error('authStorage or saveAccessToken is undefined');
        }
      } else {
        setMessage('Login failed: Invalid username or password');
      }
    } catch (error) {
      setMessage('Login failed: Invalid username or password');
      console.error('Login failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../images/IMG_001.WEBP')} style={styles.headerImage} />
        <View style={styles.overlay}>
          <Text style={styles.headerText}>Repositories App</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Pressable onPress={handleLogin} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%'  }
    ,
  overlay: {
    position: 'absolute',
    width: '20rem',
    height: '3rem',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    borderColor: '#0366d6',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    width: '250px',
    backgroundColor: 'white',
  },
  buttonContainer: {
    backgroundColor: '#0366d6',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '250px',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: 'navy',
  },
});

export default LoginScreen;
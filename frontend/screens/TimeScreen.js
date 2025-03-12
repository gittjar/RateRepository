import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Button, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';
import Config from '../components/Config';
import timezones from '../components/timezone01';
import additionalTimezones from '../components/timezone02';

const CityCard = ({ city, time, timezone, onRemove }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{city}</Text>
    <Text style={styles.cardTime}>{time}</Text>
    <Text style={styles.cardTimezone}>{timezone}</Text>
    <Button title="Remove" onPress={onRemove} />
  </View>
);

const TimeScreen = () => {
  const [cityTimes, setCityTimes] = useState({});
  const [selectedTimezone, setSelectedTimezone] = useState('timezone01');
  const [allTimezones, setAllTimezones] = useState(timezones);

  useEffect(() => {
    const fetchTimes = async () => {
      const newCityTimes = {};
      for (const tz of allTimezones) {
        for (const city of tz.cities) {
          try {
            const response = await axios.get(`${Config.baseURL}/time`, {
              params: { timezone: tz.value },
            });
            newCityTimes[city] = response.data.time; // Assuming the API returns an object with a 'time' property
          } catch (error) {
            console.error(`Failed to fetch time for ${city}`, error);
          }
        }
      }
      setCityTimes(newCityTimes);
    };

    fetchTimes();
  }, [allTimezones]);

  const removeCity = (cityToRemove) => {
    setAllTimezones((prevTimezones) =>
      prevTimezones.map((tz) => ({
        ...tz,
        cities: tz.cities.filter((city) => city !== cityToRemove),
      }))
    );
  };

  const handleTimezoneChange = (value) => {
    setSelectedTimezone(value);
    if (value === 'all_cities') {
      setAllTimezones([...timezones, ...additionalTimezones]);
    } else {
      setAllTimezones(value === 'timezone01' ? timezones : additionalTimezones);
    }
  };

  const renderCityCard = ({ item }) => (
    <CityCard
      city={item.city}
      time={cityTimes[item.city] || 'Loading...'}
      timezone={item.timezone}
      onRemove={() => removeCity(item.city)}
    />
  );

  const cities = allTimezones.flatMap(tz => tz.cities.map(city => ({ city, timezone: tz.label })));

  const numColumns = Dimensions.get('window').width > 600 ? 4 : 2;

  return (
    <View style={styles.container}>
      <Image source={require('../images/IMG_002.WEBP')} style={styles.headerImage} />
      <Text style={styles.headerTitle}>World Time</Text>
      <View style={styles.radioContainer}>
        <RadioButton.Group onValueChange={handleTimezoneChange} value={selectedTimezone}>
          <View style={styles.radioButton}>
            <RadioButton value="timezone01" />
            <Text>Timezone Set 1</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="timezone02" />
            <Text>Timezone Set 2</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="all_cities" />
            <Text>All Cities</Text>
          </View>
        </RadioButton.Group>
      </View>
      <FlatList
        data={cities}
        renderItem={renderCityCard}
        keyExtractor={(item) => item.city}
        numColumns={numColumns}
        contentContainerStyle={styles.citiesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 20,
    left: 20,
    color: 'white',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  citiesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    width: Dimensions.get('window').width / 2 - 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTime: {
    fontSize: 16,
    marginVertical: 4,
  },
  cardTimezone: {
    fontSize: 14,
    color: 'gray',
  },
});

export default TimeScreen;
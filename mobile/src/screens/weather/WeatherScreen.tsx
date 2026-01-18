import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_URL = "http://192.168.1.207:3000";

const WeatherScreen = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeathernew = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }
console.log(`${API_URL}/weather/${city}`)
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/weather/${city}`);
      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    console.log("Fetching weather for:", API_URL);

    try {
      const response = await axios.get(`${API_URL}/weather`, {
        params: { city: city.trim() },
      });

      console.log(response.data);
      setWeather(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Failed to fetch weather data");
      } else if (err.request) {
        console.log("Error request:", err);
        setError("Cannot connect to server. Make sure the backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={fetchWeather}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Weather</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : weather ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather.city}</Text>
          <Text style={styles.temp}>{Math.round(weather.temperature)}°C</Text>
          <Text style={styles.description}>{weather.description}</Text>
          {/* <View style={styles.details}>
            <Text>Humidity: {weather.main.humidity}%</Text>
            <Text>Wind: {weather.wind.speed} m/s</Text>
          </View> */}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  searchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  weatherContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  city: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WeatherScreen;

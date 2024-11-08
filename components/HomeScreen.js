import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [speed, setSpeed] = useState(0); // State for speed
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start watching position to get real-time updates, including speed
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setLocation(newLocation.coords);
          setSpeed(newLocation.coords.speed ? newLocation.coords.speed * 3.6 : 0); // Convert from m/s to km/h
        }
      );
    })();
  }, []);

  const renderMarkers = () => {
    if (!location) return null;

    return [
      { id: 1, lat: location.latitude + 0.001, lon: location.longitude + 0.001, type: 'shop' },
      { id: 2, lat: location.latitude - 0.001, lon: location.longitude - 0.001, type: 'parking' },
    ].map((marker) => (
      <Marker
        key={marker.id}
        coordinate={{ latitude: marker.lat, longitude: marker.lon }}
        title={marker.type === 'shop' ? 'Shop' : 'Parking'}
      >
        <View style={[styles.markerIcon, marker.type === 'shop' ? styles.shopMarker : styles.parkingMarker]}>
          <Icon name={marker.type === 'shop' ? 'cart-outline' : 'car-outline'} size={16} color="#fff" />
        </View>
      </Marker>
    ));
  };

  const handleSearch = async () => {
    try {
      const geocodedLocation = await Location.geocodeAsync(searchQuery);
      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setLocation({ latitude, longitude });
      } else {
        alert("Location not found");
      }
    } catch (error) {
      alert("Error fetching location. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where do you want to go?"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch} // Trigger search on submit
        />
        <TouchableOpacity style={styles.voiceIcon} onPress={handleSearch}>
          <Icon name="mic-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: location ? location.latitude : 37.78825,
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {location && renderMarkers()}
      </MapView>

      {/* Real-Time Speed Display */}
      <View style={styles.speedContainer}>
        <Text style={styles.speedText}>{speed.toFixed(1)} km/h</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  speedContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    backgroundColor: '#4D79FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginRight: 5,
  },
  voiceIcon: {
    marginLeft: 10,
  },
  markerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopMarker: {
    backgroundColor: '#4D79FF',
  },
  parkingMarker: {
    backgroundColor: '#FF6F61',
  },
});

export default HomeScreen;

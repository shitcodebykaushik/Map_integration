import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your actual API key

const TravelScreen = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      fetchNearbyPlaces(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const query = `
        [out:json];
        (
          node(around:1000,${latitude},${longitude})["amenity"="restaurant"];
          node(around:1000,${latitude},${longitude})["shop"];
          node(around:1000,${latitude},${longitude})["amenity"="hospital"];
          node(around:1000,${latitude},${longitude})["amenity"="college"];
        );
        out body;
      `;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      const fetchedPlaces = data.elements.map((element) => ({
        id: element.id,
        name: element.tags.name || 'Unnamed Place',
        type: element.tags.amenity || element.tags.shop || 'Unknown',
        lat: element.lat,
        lon: element.lon,
      }));
      setPlaces(fetchedPlaces);
    } catch (error) {
      console.error("Error fetching places: ", error);
      alert("Failed to fetch nearby places");
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (place) => {
    setSelectedPlace(place);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4D79FF" />
        <Text>Loading nearby places...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
          />
          {selectedPlace && (
            <>
              <Marker
                coordinate={{
                  latitude: selectedPlace.lat,
                  longitude: selectedPlace.lon,
                }}
                title={selectedPlace.name}
              />
              <MapViewDirections
                origin={{ latitude: location.latitude, longitude: location.longitude }}
                destination={{ latitude: selectedPlace.lat, longitude: selectedPlace.lon }}
                apikey={GOOGLE_MAPS_API_KEY}
                strokeWidth={4}
                strokeColor="blue"
              />
            </>
          )}
        </MapView>
      )}
      
      <Text style={styles.header}>Nearby Places</Text>
      {places.length > 0 ? (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.placeContainer}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeType}>{item.type}</Text>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => handleGetDirections(item)}
              >
                <Text style={styles.directionButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPlacesText}>No places found within 1000 meters.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
  },
  placeContainer: {
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  placeType: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  directionButton: {
    paddingVertical: 8,
    backgroundColor: '#4D79FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  directionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noPlacesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default TravelScreen;

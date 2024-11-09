import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatStep, setChatStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch the user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  // Render nearby markers
  const renderMarkers = () => {
    if (!location) return null;

    const markers = [
      { id: 1, latitude: location.latitude + 0.001, longitude: location.longitude + 0.001, type: 'shop' },
      { id: 2, latitude: location.latitude - 0.001, longitude: location.longitude - 0.001, type: 'parking' },
    ];

    return markers.map(marker => (
      <Marker
        key={marker.id}
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      >
        <View style={[styles.markerIcon, marker.type === 'shop' ? styles.shopMarker : styles.parkingMarker]}>
          <Icon name={marker.type === 'shop' ? 'storefront-outline' : 'car-outline'} size={20} color="#fff" />
        </View>
      </Marker>
    ));
  };

  // Chatbot functionality
  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    handleChatFlow(message.trim());
    setMessage('');
  };

  const handleChatFlow = (userResponse) => {
    let botMessage = '';

    switch (chatStep) {
      case 1:
        if (userResponse.toLowerCase() === 'yes') {
          const currentDate = new Date();
          botMessage = `Today's date is ${currentDate.toLocaleDateString()} and the time is ${currentDate.toLocaleTimeString()}.`;
        } else {
          botMessage = "Alright! What issue are you experiencing?";
        }
        setChatStep(2);
        break;

      case 2:
        botMessage = "It seems like a network issue. Please try rebooting your system.";
        setChatStep(3);
        break;

      case 3:
        botMessage = "Did rebooting solve your issue? Reply with 'yes' or 'no'.";
        setChatStep(4);
        break;

      case 4:
        if (userResponse.toLowerCase() === 'yes') {
          botMessage = "Great! I'm glad the issue is resolved.";
        } else {
          botMessage = "Your problem has been registered. Please call customer support at 6200174741.";
        }
        setChatStep(1); // Reset the chat flow
        break;

      default:
        botMessage = "How else may I assist you?";
        setChatStep(1);
    }

    setChatMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now().toString(), text: botMessage, sender: 'bot' },
    ]);
  };

  const renderChatMessage = ({ item }) => (
    <View style={[styles.chatBubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.chatText}>{item.text}</Text>
      {item.call && (
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.text}`)} style={styles.callButton}>
          <Icon name="call-outline" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Map View */}
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

      {/* Speed Panel */}
      <View style={styles.speedContainer}>
        <Text style={styles.speedText}>7 km/h</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where do you want to go?"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.voiceIcon}>
          <Icon name="mic-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Chatbot Icon */}
      <TouchableOpacity style={styles.chatbotIcon} onPress={() => setIsChatVisible(true)}>
        <Icon name="chatbubble-ellipses-outline" size={24} color="#4D79FF" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isChatVisible}
        onRequestClose={() => setIsChatVisible(false)}
      >
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.chatContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsChatVisible(false)}>
              <Icon name="close" size={24} color="#4D79FF" />
            </TouchableOpacity>
            <FlatList
              data={chatMessages}
              renderItem={renderChatMessage}
              keyExtractor={(item) => item.id}
              style={styles.chatList}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Icon name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  speedContainer: {
    position: 'absolute',
    top: 150,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  speedText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  searchContainer: {
    position: 'absolute',
    bottom: 480,
    left: 20,
    right: 20,
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
  chatbotIcon: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatContainer: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  chatList: { flexGrow: 0, paddingHorizontal: 10 },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: { backgroundColor: '#4D79FF', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#e5e5ea', alignSelf: 'flex-start' },
  chatText: { color: '000' },
  callButton: {
    marginLeft: 10,
    backgroundColor: '#4D79FF',
    padding: 8,
    borderRadius: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  chatInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4D79FF',
    padding: 10,
    borderRadius: 20,
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

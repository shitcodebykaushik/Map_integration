// components/UserProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const UserProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState({ fullName: '', email: '' });
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isSavedPlacesVisible, setSavedPlacesVisible] = useState(false);
  const [isPaymentMethodsVisible, setPaymentMethodsVisible] = useState(false);

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Assuming user ID is passed via route params after login
        const userId = route.params?.userId;
        const response = await axios.get(`https://map-jt0k.onrender.com/auth/user/${userId}`);
        setUser({ fullName: response.data.full_name, email: response.data.email });
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Signup' } }],
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/user-avatar.png' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.option} onPress={() => setEditProfileVisible(true)}>
          <Icon name="person-outline" size={24} color="#4D79FF" style={styles.optionIcon} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => setSavedPlacesVisible(true)}>
          <Icon name="bookmark-outline" size={24} color="#4D79FF" style={styles.optionIcon} />
          <Text style={styles.optionText}>Saved Places</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => setPaymentMethodsVisible(true)}>
          <Icon name="card-outline" size={24} color="#4D79FF" style={styles.optionIcon} />
          <Text style={styles.optionText}>Payment Methods</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#FF5252" style={styles.optionIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={isEditProfileVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput placeholder="Full Name" style={styles.input} value={user.fullName} onChangeText={(text) => setUser((prev) => ({ ...prev, fullName: text }))} />
            <TextInput placeholder="Email" style={styles.input} value={user.email} onChangeText={(text) => setUser((prev) => ({ ...prev, email: text }))} keyboardType="email-address" />
            <Button title="Save" onPress={() => setEditProfileVisible(false)} />
            <Button title="Cancel" onPress={() => setEditProfileVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
});

export default UserProfileScreen;

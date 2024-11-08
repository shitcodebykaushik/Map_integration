// components/SignupScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://example.com/logo.png' }} style={styles.logo} />

      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'HomeTab' }],
        })}
      >
        <Text style={styles.signupButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#FF5252',
    borderRadius: 8,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#888',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF5252',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '600',
  },
});

export default SignupScreen;

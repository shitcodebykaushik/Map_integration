// App.js
import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

import SignupScreen from './components/Sign';
import LoginScreen from './components/login';
import HomeScreen from './components/HomeScreen';
import CampaignPage from './components/campign';
import TravelScreen from './components/TravelScreen';
import LogoutScreen from './components/Logout';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// Home Stack Navigator
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Campaign" component={CampaignPage} options={{ title: 'Campaign Details' }} />
  </Stack.Navigator>
);

const MainTabs = ({ toggleTheme, isDarkMode }) => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="HomeStack"
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Travel"
      component={TravelScreen}
      options={{
        tabBarLabel: 'Travel',
        tabBarIcon: ({ color, size }) => (
          <Icon name="airplane-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={LogoutScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon name="person-outline" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen
      name="ThemeToggle"
      component={HomeStack} // Use any existing component (e.g., HomeStack) since we are not navigating to it
      options={{
        tabBarLabel: 'Theme',
        tabBarIcon: ({ color, size }) => (
          <TouchableOpacity onPress={toggleTheme}>
            <Icon 
              name={isDarkMode ? "sunny-outline" : "moon-outline"} 
              color={color} 
              size={size} 
            />
          </TouchableOpacity>
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: e => {
          e.preventDefault(); // Prevent navigation on tab press
          toggleTheme(); // Call toggleTheme function instead
        },
      })}
    />
  </Tab.Navigator>
);

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode state
  const toggleTheme = () => setIsDarkMode(prevState => !prevState);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="HomeTab">
          {() => <MainTabs toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

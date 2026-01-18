import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import WeatherScreen from '../screens/weather/WeatherScreen';
import DiscoverScreen from '../screens/tabs/DiscoverScreen';
import MatchesScreen from '../screens/tabs/MatchesScreen';
import LikesScreen from '../screens/tabs/LikesScreen';
import MessagesScreen from '../screens/tabs/MessagesScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

// Import types
import type { RootStackParamList, TabParamList } from './types';
import SignUpScreen from '../screens/auth/SignupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab Navigator
const HomeTabs = () => {
  return (
    <Tab.Navigator
      id="MainTabs"
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          switch (route.name) {
            case 'Discover':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Matches':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Likes':
              iconName = focused ? 'thumbs-up' : 'thumbs-up-outline';
              break;
            case 'Messages':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity 
            style={{ marginRight: 15 }}
            onPress={() => (navigation as any).navigate('Weather')}
          >
            <Ionicons name="partly-sunny-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        ),
      })}
    >
      <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen} 
        options={{ title: 'Discover' }}
      />
      <Tab.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ title: 'Matches' }}
      />
      <Tab.Screen 
        name="Likes" 
        component={LikesScreen} 
        options={{ title: 'Likes' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ title: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const RootNavigator: React.FC = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    // Show splash screen or loading indicator
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
            <Stack.Screen name="MainTabs" component={HomeTabs} />
            <Stack.Screen 
              name="Weather" 
              component={WeatherScreen}
              options={{ headerShown: true, title: 'Weather Forecast' }}
            />
          </>
        ) : (
          <>

<Stack.Screen 
  name="Login" 
  component={LoginScreen} 
  options={{ gestureEnabled: false }}
/>
            <Stack.Screen 
              name="Signup" 
              component={SignUpScreen} 
              options={{ gestureEnabled: false }}
            />
          
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Sparkles, Heart, MessageCircle, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#EF5A6F',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Home size={28} color={color} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Sparkles size={28} color={color} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#EF5A6F',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -30,
              shadowColor: '#EF5A6F',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Heart size={28} color="#FFFFFF" fill="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <MessageCircle size={28} color={color} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <User size={28} color={color} fill={focused ? color : 'transparent'} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
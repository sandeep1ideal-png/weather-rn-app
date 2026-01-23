// ✅ Splash Screen on App Launch

// 1️⃣ Create Splash Screen Component
import { View, Image, ActivityIndicator, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Logo/App Icon */}
      <Image
        source={require('@/assets/foregroundImage.png')} // Your app logo
        style={{
          width: 120,
          height: 120,
          marginBottom: 30,
          resizeMode: 'contain',
        }}
      />

      {/* App Name */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 30,
          color: '#000',
        }}
      >
        Your App Name
      </Text>

      {/* Loading Spinner */}
      <ActivityIndicator size="large" color="#007AFF" />

      {/* Loading Text */}
      <Text
        style={{
          marginTop: 20,
          color: '#999',
          fontSize: 14,
        }}
      >
        Loading...
      </Text>
    </View>
  );
}
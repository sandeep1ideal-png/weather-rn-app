# Weather Mobile App

React Native mobile application built with Expo for checking weather information.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the API_URL in `App.js` if needed:
   - iOS Simulator: `http://localhost:3000`
   - Android Emulator: `http://10.0.2.2:3000`
   - Physical Device: Your computer's IP (e.g., `http://192.168.1.100:3000`)

## Running

```bash
npm start
```

This will start the Expo development server. Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Features

- Search weather by city name
- Display current temperature in Celsius
- Show weather description
- Loading states
- Error handling
- Clean, responsive UI

## Troubleshooting

If you can't connect to the backend:
1. Make sure the backend server is running
2. Check your API_URL configuration
3. For physical devices, ensure phone and computer are on the same WiFi network

# Weather App - Full Stack Project

A full-stack weather application with a Node.js/Express backend and React Native mobile frontend using Expo.

## Project Structure

```
weather-rn-app/
├── backend/          # Node.js Express API server
│   ├── server.js
│   ├── package.json
│   └── .env
└── mobile/           # React Native Expo app
    ├── App.js
    ├── app.json
    ├── package.json
    └── babel.config.js
```

## Features

### Backend
- Node.js + Express REST API
- Weather data fetching from OpenWeather API
- CORS enabled for mobile app communication
- Error handling for invalid cities and API errors

### Mobile App
- React Native with Expo
- Clean and intuitive UI
- City search functionality
- Loading indicators
- Error handling with user-friendly messages
- Real-time weather display (temperature, description)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)
- OpenWeather API key (free tier available at https://openweathermap.org/api)
- iOS Simulator (for Mac) or Android Emulator, or Expo Go app on your phone

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd weather-rn-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file and add your OpenWeather API key:

```
PORT=3000
OPENWEATHER_API_KEY=your_actual_api_key_here
```

To get your OpenWeather API key:
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key

### 3. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install
```

### 4. Running the Application

You need to run both the backend and mobile app simultaneously.

#### Start the Backend Server

```bash
cd backend
npm start
```

The server will start on http://localhost:3000

#### Start the Mobile App

In a new terminal:

```bash
cd mobile
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your phone

## API Endpoints

### GET /weather

Fetch weather data for a specific city.

**Query Parameters:**
- `city` (required): Name of the city

**Success Response (200):**
```json
{
  "city": "London",
  "temperature": 15.5,
  "description": "partly cloudy"
}
```

**Error Responses:**
- 400: Missing city parameter
- 404: City not found
- 500: Server error or API key not configured

### GET /health

Health check endpoint.

**Success Response (200):**
```json
{
  "status": "ok"
}
```

## Configuration

### Mobile App

To connect to the backend, update the `API_URL` in `mobile/App.js`:

- **iOS Simulator**: Use `http://localhost:3000`
- **Android Emulator**: Use `http://10.0.2.2:3000`
- **Physical Device**: Use your computer's local IP (e.g., `http://192.168.1.100:3000`)

## Troubleshooting

### Backend Issues

**"OpenWeather API key not configured"**
- Make sure you created a `.env` file in the backend directory
- Verify your API key is correct and active

**"Cannot connect to OpenWeather API"**
- Check your internet connection
- Verify your API key is valid
- Free tier API keys may have rate limits

### Mobile App Issues

**"Cannot connect to server"**
- Make sure the backend server is running
- Check that the `API_URL` in `App.js` is correct for your setup
- For physical devices, ensure your phone and computer are on the same network

**Expo not starting**
- Clear Expo cache: `expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Development

### Adding New Features

**Backend:**
1. Add new routes in `server.js`
2. Follow the existing error handling pattern
3. Test endpoints using Postman or curl

**Mobile:**
1. Components can be added as separate files in a `components/` directory
2. Follow React Native styling conventions
3. Test on both iOS and Android if possible

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Axios
  - CORS
  - dotenv

- **Mobile:**
  - React Native
  - Expo
  - Axios
  - React Hooks

## License

MIT

# Weather Backend API

Node.js Express server that provides weather data from OpenWeather API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your OpenWeather API key to `.env`:
```
OPENWEATHER_API_KEY=your_api_key_here
```

## Running

```bash
npm start
```

Server will run on port 3000 by default.

## API Endpoints

### GET /weather?city={cityName}
Returns weather data for the specified city.

Example:
```bash
curl "http://localhost:3000/weather?city=London"
```

Response:
```json
{
  "city": "London",
  "temperature": 15.5,
  "description": "partly cloudy"
}
```

### GET /health
Health check endpoint.

Response:
```json
{
  "status": "ok"
}
```

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/weather', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'OpenWeather API key not configured' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    };

    res.json(weatherData);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return res.status(404).json({ error: 'City not found' });
      }
      return res.status(error.response.status).json({ error: error.response.data.message || 'Error fetching weather data' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
});

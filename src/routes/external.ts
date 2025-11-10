import express from 'express';
import axios from 'axios';

const router = express.Router();

// Simple in-memory cache
const weatherCache: Record<string, { data: any, timestamp: number }> = {};

// OpenWeatherMap API config
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

router.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });
  const cacheKey = `${lat},${lon}`;
  const now = Date.now();
  if (weatherCache[cacheKey] && now - weatherCache[cacheKey].timestamp < 10 * 60 * 1000) {
    return res.json(weatherCache[cacheKey].data);
  }
  try {
    console.log('OpenWeather API key:', WEATHER_API_KEY);
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });
    weatherCache[cacheKey] = { data: response.data, timestamp: now };
    res.json(response.data);
  } catch (err) {
    console.error('Weather API error:', err);
    const message = typeof err === 'object' && err !== null && 'message' in err ? (err as any).message : String(err);
    res.status(500).json({ error: 'Weather API error', details: message });
  }
});

router.get('/rates', async (req, res) => {
  let base = req.query.base ?? 'USD';
  let targetRaw = req.query.target ?? 'COP';
  let target: string;
  if (Array.isArray(targetRaw)) {
    target = String(targetRaw[0]);
  } else {
    target = String(targetRaw);
  }
  try {
    const response = await axios.get(`https://api.exchangerate.host/latest`, {
      params: { base, symbols: target },
    });
  const rate = response.data.rates?.[target as string];
    if (!rate) return res.status(404).json({ error: 'Rate not found' });
    res.json({ base, target, rate });
  } catch (err) {
    const message = typeof err === 'object' && err !== null && 'message' in err ? (err as any).message : String(err);
    res.status(500).json({ error: 'Rates API error', details: message });
  }
});

export default router;

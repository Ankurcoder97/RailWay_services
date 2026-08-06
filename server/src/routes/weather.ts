import { Router } from 'express';
import { getWeatherForStation } from '../services/openWeather';

const router = Router();

router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const name = (req.query.name as string) || code;
    const lat = parseFloat(req.query.lat as string) || 28.6441;
    const lng = parseFloat(req.query.lng as string) || 77.2197;

    const weather = await getWeatherForStation(code, name, lat, lng);
    res.json(weather);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch weather' });
  }
});

export default router;

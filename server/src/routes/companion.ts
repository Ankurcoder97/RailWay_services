import { Router } from 'express';
import { getNearbyLandmarks } from '../services/overpass';

const router = Router();

router.get('/landmarks', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat as string) || 26.4547;
    const lng = parseFloat(req.query.lng as string) || 80.3498;
    const radius = parseFloat(req.query.radius as string) || 25;

    const landmarks = await getNearbyLandmarks(lat, lng, radius);
    res.json(landmarks);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch landmarks' });
  }
});

export default router;

import { Router } from 'express';
import { searchTrains, getLiveTrainStatus } from '../services/railradar';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.json([]);
    }
    const results = await searchTrains(q);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to search trains' });
  }
});

router.get('/:id/status', async (req, res) => {
  try {
    const trainId = req.params.id;
    const status = await getLiveTrainStatus(trainId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch live status' });
  }
});

export default router;

import { Router } from 'express';
import { getElevationProfile } from '../services/openTopography';
import { getLiveTrainStatus } from '../services/railradar';

const router = Router();

router.get('/:id/elevation', async (req, res) => {
  try {
    const trainId = req.params.id;
    const status = await getLiveTrainStatus(trainId);
    const elevationData = await getElevationProfile(status.routeCoordinates, status.totalDistanceKm);
    
    res.json({
      trainNumber: status.trainNumber,
      totalDistanceKm: status.totalDistanceKm,
      highestElevationM: Math.max(...elevationData.map(e => e.elevationM), 100),
      lowestElevationM: Math.min(...elevationData.map(e => e.elevationM), 10),
      profile: elevationData
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch elevation analytics' });
  }
});

export default router;

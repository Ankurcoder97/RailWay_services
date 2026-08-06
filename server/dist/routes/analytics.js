"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openTopography_1 = require("../services/openTopography");
const railradar_1 = require("../services/railradar");
const router = (0, express_1.Router)();
router.get('/:id/elevation', async (req, res) => {
    try {
        const trainId = req.params.id;
        const status = await (0, railradar_1.getLiveTrainStatus)(trainId);
        const elevationData = await (0, openTopography_1.getElevationProfile)(status.routeCoordinates, status.totalDistanceKm);
        res.json({
            trainNumber: status.trainNumber,
            totalDistanceKm: status.totalDistanceKm,
            highestElevationM: Math.max(...elevationData.map(e => e.elevationM), 100),
            lowestElevationM: Math.min(...elevationData.map(e => e.elevationM), 10),
            profile: elevationData
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch elevation analytics' });
    }
});
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const overpass_1 = require("../services/overpass");
const router = (0, express_1.Router)();
router.get('/landmarks', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat) || 26.4547;
        const lng = parseFloat(req.query.lng) || 80.3498;
        const radius = parseFloat(req.query.radius) || 25;
        const landmarks = await (0, overpass_1.getNearbyLandmarks)(lat, lng, radius);
        res.json(landmarks);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch landmarks' });
    }
});
exports.default = router;

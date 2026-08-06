"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const railradar_1 = require("../services/railradar");
const router = (0, express_1.Router)();
router.get('/search', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) {
            return res.json([]);
        }
        const results = await (0, railradar_1.searchTrains)(q);
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to search trains' });
    }
});
router.get('/:id/status', async (req, res) => {
    try {
        const trainId = req.params.id;
        const status = await (0, railradar_1.getLiveTrainStatus)(trainId);
        res.json(status);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch live status' });
    }
});
exports.default = router;

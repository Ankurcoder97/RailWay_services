"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openWeather_1 = require("../services/openWeather");
const router = (0, express_1.Router)();
router.get('/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const name = req.query.name || code;
        const lat = parseFloat(req.query.lat) || 28.6441;
        const lng = parseFloat(req.query.lng) || 77.2197;
        const weather = await (0, openWeather_1.getWeatherForStation)(code, name, lat, lng);
        res.json(weather);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch weather' });
    }
});
exports.default = router;

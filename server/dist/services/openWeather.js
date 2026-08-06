"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherForStation = getWeatherForStation;
const axios_1 = __importDefault(require("axios"));
async function getWeatherForStation(stationCode, stationName, lat, lng) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey) {
        try {
            const response = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`, {
                timeout: 4000
            });
            const data = response.data;
            return {
                stationCode,
                stationName,
                tempC: Math.round(data.main.temp),
                condition: data.weather[0]?.main || 'Clear',
                description: data.weather[0]?.description || 'clear sky',
                humidityPercent: data.main.humidity,
                windSpeedKmh: Math.round(data.wind.speed * 3.6),
                rainProbabilityPercent: data.rain ? Math.min(Math.round((data.rain['1h'] || 0) * 20), 100) : 10,
                icon: data.weather[0]?.icon || '01d'
            };
        }
        catch (e) {
            console.warn(`OpenWeather call failed for ${stationCode}, falling back to mock weather.`);
        }
    }
    // Realistic seasonal mock data for Indian stations
    const seed = stationCode.charCodeAt(0) + (stationCode.charCodeAt(1) || 0);
    const tempC = 22 + (seed % 12);
    const humidityPercent = 45 + (seed % 40);
    const windSpeedKmh = 8 + (seed % 15);
    const rainProb = (seed % 3) === 0 ? 65 : 15;
    const condition = rainProb > 50 ? 'Rainy' : tempC > 30 ? 'Sunny' : 'Partly Cloudy';
    return {
        stationCode,
        stationName,
        tempC,
        condition,
        description: condition === 'Rainy' ? 'Light rain expected' : 'Mild breeze and pleasant',
        humidityPercent,
        windSpeedKmh,
        rainProbabilityPercent: rainProb,
        icon: condition === 'Rainy' ? '10d' : tempC > 30 ? '01d' : '02d'
    };
}

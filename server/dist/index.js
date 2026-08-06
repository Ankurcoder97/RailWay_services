"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const trains_1 = __importDefault(require("./routes/trains"));
const weather_1 = __importDefault(require("./routes/weather"));
const companion_1 = __importDefault(require("./routes/companion"));
const analytics_1 = __importDefault(require("./routes/analytics"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/trains', trains_1.default);
app.use('/api/weather', weather_1.default);
app.use('/api/companion', companion_1.default);
app.use('/api/analytics', analytics_1.default);
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'RailGaadi Backend Engine',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`🚆 RailGaadi Express server running on port ${PORT}`);
});

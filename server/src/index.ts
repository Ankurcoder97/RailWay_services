import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import trainsRouter from './routes/trains';
import weatherRouter from './routes/weather';
import companionRouter from './routes/companion';
import analyticsRouter from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/trains', trainsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/companion', companionRouter);
app.use('/api/analytics', analyticsRouter);

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

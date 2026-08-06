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

// Root Landing & API Status Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>RailGaadi API Engine</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #fff; padding: 40px; line-height: 1.6; }
          .card { background: #1e293b; padding: 30px; border-radius: 16px; max-width: 600px; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-top: 0; }
          .badge { background: #059669; color: #fff; padding: 4px 10px; border-radius: 99px; font-weight: bold; font-size: 12px; }
          ul { padding-left: 20px; }
          a { color: #38bdf8; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚆 RailGaadi Express Server</h1>
          <p><span class="badge">ONLINE</span> Backend API microservices running on Render.</p>
          <hr style="border-color: #334155; margin: 20px 0;" />
          <h3>Active API Endpoints:</h3>
          <ul>
            <li>Health Check: <a href="/api/health">/api/health</a></li>
            <li>Live Train Status: <a href="/api/trains/22436/status">/api/trains/22436/status</a></li>
            <li>Train Search: <a href="/api/trains/search?q=12626">/api/trains/search?q=12626</a></li>
            <li>Station Weather: <a href="/api/weather?code=CNB&name=Kanpur&lat=26.45&lng=80.34">/api/weather</a></li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// API Routes
app.use('/api/trains', trainsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/companion', companionRouter);
app.use('/api/analytics', analyticsRouter);

// Health Check Endpoint
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

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { processChatConversation, generateAITripPlan, parseNaturalLanguageQuery } from './server/geminiService';
import { fetchLiveWeather } from './server/weatherService';
import { POPULAR_DESTINATIONS_LIST } from './server/travelData';
import type { TripPlan } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory saved trips storage with initial sample
const savedTrips: Map<string, TripPlan> = new Map();

// API ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TourAI Travel Agent & Smart Trip Planner',
    hasGeminiKey: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// Popular destinations list
app.get('/api/destinations/popular', (req, res) => {
  res.json(POPULAR_DESTINATIONS_LIST);
});

// Real-time live weather lookup (Open-Meteo)
app.get('/api/weather', async (req, res) => {
  try {
    const location = (req.query.location as string) || 'Ooty';
    const weather = await fetchLiveWeather(location);
    res.json(weather);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

// AI Travel Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message string is required' });
      return;
    }

    const result = await processChatConversation(message, history);

    // If a trip plan was generated, save it into memory
    if (result.tripPlan) {
      savedTrips.set(result.tripPlan.id, result.tripPlan);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error?.message || 'Unknown error',
    });
  }
});

// AI Trip Planner endpoint
app.post('/api/plan', async (req, res) => {
  try {
    const body = req.body || {};
    let query = body;

    // If query came in as a natural language text prompt
    if (body.prompt && typeof body.prompt === 'string') {
      const extracted = parseNaturalLanguageQuery(body.prompt);
      query = { ...extracted, ...body };
    }

    const plan = await generateAITripPlan(query);
    savedTrips.set(plan.id, plan);

    res.json(plan);
  } catch (error: any) {
    console.error('Plan generation error:', error);
    res.status(500).json({
      error: 'Failed to generate trip plan',
      details: error?.message || 'Unknown error',
    });
  }
});

// Saved Trips endpoints
app.get('/api/trips', (req, res) => {
  const list = Array.from(savedTrips.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(list);
});

app.post('/api/trips', (req, res) => {
  const trip = req.body as TripPlan;
  if (!trip || !trip.id) {
    res.status(400).json({ error: 'Invalid trip object' });
    return;
  }
  savedTrips.set(trip.id, trip);
  res.json({ success: true, trip });
});

app.delete('/api/trips/:id', (req, res) => {
  const { id } = req.params;
  const existed = savedTrips.delete(id);
  res.json({ success: existed });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TourAI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

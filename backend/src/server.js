import express from 'express';
import cors from 'cors';
import { featurePrioritization, feedbackChannels } from './data.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

let features = [...featurePrioritization];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'voice-of-customer-prioritization', timestamp: new Date().toISOString() });
});

app.get('/api/features', (req, res) => {
  res.json({
    features,
    summary: {
      totalFeatures: features.length,
      totalArrUsd: features.reduce((acc, f) => acc + f.revenueArrUsd, 0),
      mustBeCount: features.filter(f => f.kanoCategory === 'Must-Be').length,
      delighterCount: features.filter(f => f.kanoCategory === 'Delighter').length
    }
  });
});

app.post('/api/features/:id/update-rice', (req, res) => {
  const { id } = req.params;
  const { reach, impact, confidence, effort } = req.body;
  const feat = features.find(f => f.id === id);
  if (!feat) return res.status(404).json({ error: 'Feature not found' });

  if (reach !== undefined) feat.reach = Number(reach);
  if (impact !== undefined) feat.impact = Number(impact);
  if (confidence !== undefined) feat.confidence = Number(confidence);
  if (effort !== undefined) feat.effort = Number(effort);

  feat.riceScore = Math.round((feat.reach * feat.impact * feat.confidence) / (feat.effort || 1));
  res.json({ message: `Updated RICE score for ${id}`, feature: feat });
});

app.get('/api/channels', (req, res) => {
  res.json({ channels: feedbackChannels });
});

app.listen(PORT, () => {
  console.log(`Voice of Customer Intelligence API running on port ${PORT}`);
});

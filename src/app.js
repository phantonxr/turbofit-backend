require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const workoutRoutes = require('./routes/workouts');
const habitRoutes = require('./routes/habits');
const videoRoutes = require('./routes/videos');
const stripeRoutes = require('./routes/stripe');
const subscriptionRoutes = require('./routes/subscription');
const aiRoutes = require('./routes/ai');
const measurementRoutes = require('./routes/measurements');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
app.use((req, res, next) => {
  if (req.originalUrl === '/stripe/webhook') return next();
  return express.json({ limit: '1mb' })(req, res, next);
});

app.use('/auth', authRoutes);
app.use(meRoutes);
app.use(workoutRoutes);
app.use(habitRoutes);
app.use(videoRoutes);
app.use(stripeRoutes);
app.use(subscriptionRoutes);
app.use(aiRoutes);
app.use(measurementRoutes);
app.use(adminRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ error: 'Erro interno' });
});

module.exports = app;

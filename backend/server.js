require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/rateLimiter');

const authRoutes = require('./routes/authRoutes');
const entryRoutes = require('./routes/entryRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const profileRoutes = require('./routes/profileRoutes');

connectDB();

const app = express();

// Security & performance middleware
// crossOriginResourcePolicy is relaxed to 'cross-origin' because the frontend
// (Vite, a different port) needs to fetch this JSON API directly
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, message: 'LifeGrid API is running' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`LifeGrid API listening on port ${PORT}`));

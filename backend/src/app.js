const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { error } = require('./utils/apiResponse');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Cross-Origin Requests Setup
app.use(cors({
  origin: '*', // Allow all origins for internship evaluation convenience, customisable in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Logger Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Request Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Global API Rate Limiter
app.use('/api', apiLimiter);

// 6. Base Routes mount
app.use('/api', routes);

// 7. Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 8. 404 Route Fallback
app.use((req, res, next) => {
  return error(res, `Endpoint '${req.originalUrl}' not found. Please verify route paths.`, 404);
});

// 9. Central Error Handler (must be last)
app.use(errorHandler);

module.exports = app;

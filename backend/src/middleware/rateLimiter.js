const rateLimit = require('express-rate-limit');
const { error } = require('../utils/apiResponse');

// Limit general API requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return error(res, 'Too many requests from this IP. Please try again after 15 minutes.', 429);
  }
});

// Stricter limit on heavy GitHub analysis queries
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 analysis queries per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return error(res, 'GitHub analysis rate limit reached. You can only analyze 20 profiles per hour.', 429);
  }
});

module.exports = {
  apiLimiter,
  analysisLimiter
};

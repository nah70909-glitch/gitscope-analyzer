const logger = require('../utils/logger');
const { error } = require('../utils/apiResponse');

/**
 * Express centralized error handling middleware
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred on the server';

  // Log full error stack
  logger.error(`[HTTP ${statusCode}] ${req.method} ${req.originalUrl} - ${message}`, err);

  // In production, do not return developer stack info
  const details = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    details: err.details || null
  } : null;

  return error(res, message, statusCode, details);
}

module.exports = errorHandler;

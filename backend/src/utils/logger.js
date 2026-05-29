/**
 * Structured Logging System
 */

const levels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

function formatMessage(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}]: ${message}`;
}

const logger = {
  info: (message) => console.log(formatMessage(levels.INFO, message)),
  warn: (message) => console.warn(formatMessage(levels.WARN, message)),
  error: (message, err) => {
    console.error(formatMessage(levels.ERROR, message));
    if (err && err.stack) {
      console.error(err.stack);
    }
  },
  success: (message) => console.log(formatMessage(levels.SUCCESS, message))
};

module.exports = logger;

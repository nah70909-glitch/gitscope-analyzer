/**
 * Unified Production-Grade JSON API Response Utilities
 */

/**
 * Send standard success response
 * @param {Object} res Express response object
 * @param {string} message Custom success message
 * @param {Object|Array} data Payload data
 * @param {number} statusCode HTTP status code
 */
function success(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send standard error response
 * @param {Object} res Express response object
 * @param {string} message Custom error message
 * @param {number} statusCode HTTP status code
 * @param {any} errors Detail stack or error structure
 */
function error(res, message, statusCode = 500, errors = null) {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  success,
  error
};

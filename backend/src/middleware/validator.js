const { error } = require('../utils/apiResponse');

/**
 * Validate GitHub username parameter format
 */
function validateUsernameParam(req, res, next) {
  const { username } = req.params;

  if (!username) {
    return error(res, 'Username parameter is required', 400);
  }

  // GitHub username specifications:
  // Alphanumeric with single hyphens, cannot begin or end with a hyphen, max 39 characters
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  if (!githubUsernameRegex.test(username)) {
    return error(res, 'Invalid GitHub username format', 400);
  }

  next();
}

/**
 * Validate numeric ID parameters (for fetches / deletions)
 */
function validateIdParam(req, res, next) {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0) {
    return error(res, 'Invalid profile ID. Must be a positive integer.', 400);
  }

  next();
}

module.exports = {
  validateUsernameParam,
  validateIdParam
};

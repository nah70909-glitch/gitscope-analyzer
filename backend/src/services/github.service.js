const axios = require('axios');
require('dotenv').config();

const GITHUB_API_URL = 'https://api.github.com';

// Build authenticated axios instance
const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitScope-Analyzer-SaaS'
  }
});

// Add auth token if present
const token = process.env.GITHUB_TOKEN;
if (token && token.trim() !== '') {
  githubClient.defaults.headers.common['Authorization'] = `token ${token.trim()}`;
  console.log('[GitHub Service] Authenticated requests configured via GITHUB_TOKEN.');
} else {
  console.log('[GitHub Service] Warning: Running unauthenticated. GitHub API rate limits will be capped at 60/hr.');
}

/**
 * Fetch general GitHub profile of a developer
 * @param {string} username 
 * @returns {Promise<Object>}
 */
async function fetchUserProfile(username) {
  try {
    const response = await githubClient.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const err = new Error('GitHub profile not found');
      err.status = 404;
      throw err;
    }
    if (error.response && error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
      const err = new Error('GitHub API rate limit exceeded. Please configure GITHUB_TOKEN in your backend environment.');
      err.status = 429;
      throw err;
    }
    throw error;
  }
}

/**
 * Fetch all public repositories of a developer (handling pagination up to 500 repos)
 * @param {string} username 
 * @returns {Promise<Array>}
 */
async function fetchUserRepositories(username) {
  const repositories = [];
  let page = 1;
  const perPage = 100;
  const maxPages = 5; // Capping at 500 repositories for speed, correctness, and security

  try {
    while (page <= maxPages) {
      const response = await githubClient.get(`/users/${username}/repos`, {
        params: {
          per_page: perPage,
          page: page,
          type: 'owner',
          sort: 'updated'
        }
      });

      const pageRepos = response.data;
      if (!pageRepos || pageRepos.length === 0) {
        break;
      }

      repositories.push(...pageRepos);
      
      // If we got fewer than 100 repositories, we are on the last page
      if (pageRepos.length < perPage) {
        break;
      }
      page++;
    }
    return repositories;
  } catch (error) {
    if (error.response && error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
      const err = new Error('GitHub API rate limit exceeded. Please configure GITHUB_TOKEN.');
      err.status = 429;
      throw err;
    }
    throw error;
  }
}

module.exports = {
  fetchUserProfile,
  fetchUserRepositories
};

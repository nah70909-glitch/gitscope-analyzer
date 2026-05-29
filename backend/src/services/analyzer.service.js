/**
 * Calculate the developer intelligence score and assign rankings.
 */

/**
 * Calculates years between two dates
 * @param {string|Date} dateString 
 * @returns {number}
 */
function calculateAccountAgeInYears(dateString) {
  if (!dateString) return 0;
  const createdAt = new Date(dateString);
  const now = new Date();
  const diffInMs = now - createdAt;
  const msInYear = 1000 * 60 * 60 * 24 * 365.25;
  const age = diffInMs / msInYear;
  return parseFloat(age.toFixed(2));
}

/**
 * Aggregate top language from repository array
 * @param {Array} repos 
 * @returns {string}
 */
function determineTopLanguage(repos) {
  if (!repos || repos.length === 0) return 'None';
  
  const languageCounts = {};
  repos.forEach(repo => {
    const lang = repo.language;
    if (lang && lang !== 'null') {
      languageCounts[lang] = (languageCounts[lang] || 0) + 1;
    }
  });

  let topLang = 'None';
  let maxCount = 0;
  
  for (const [lang, count] of Object.entries(languageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topLang = lang;
    }
  }

  return topLang;
}

/**
 * Run advanced analysis on developer profile and repository list
 * @param {Object} profile 
 * @param {Array} repos 
 * @returns {Object}
 */
function analyzeDeveloperData(profile, repos) {
  const followers = profile.followers || 0;
  const publicRepos = profile.public_repos || 0;
  const accountAgeYears = calculateAccountAgeInYears(profile.created_at);

  let totalStars = 0;
  let totalForks = 0;
  let mostStarredRepo = 'None';
  let maxStars = -1;

  // Process repository aggregations
  repos.forEach(repo => {
    // Only aggregate stats from original repos or calculate overall total
    const repoStars = repo.stargazers_count || 0;
    const repoForks = repo.forks_count || 0;
    
    totalStars += repoStars;
    totalForks += repoForks;

    if (repoStars > maxStars) {
      maxStars = repoStars;
      mostStarredRepo = repo.name;
    }
  });

  const topLanguage = determineTopLanguage(repos);

  // LOG-SCALED FORMULA DESIGN (Maximum 100 Points):
  // 1. Followers Score (Max 25): Capped log-scaled. e.g. log10(10) = 1, log10(100) = 2, log10(10000) = 4.
  const followersScore = Math.min(25, Math.round(Math.log10(followers + 1) * 7.5));

  // 2. Stars Score (Max 35): Capped log-scaled. Reward highly starred builders.
  const starsScore = Math.min(35, Math.round(Math.log10(totalStars + 1) * 10));

  // 3. Forks Score (Max 15): Capped log-scaled.
  const forksScore = Math.min(15, Math.round(Math.log10(totalForks + 1) * 5));

  // 4. Longevity Score (Max 10): 1.5 points per year, caps at 10 (approx 7 years)
  const longevityScore = Math.min(10, Math.round(accountAgeYears * 1.5));

  // 5. Repos Count Score (Max 15): Capped log-scaled public repos.
  const reposScore = Math.min(15, Math.round(Math.log10(publicRepos + 1) * 5));

  // Summing elements (Max 100)
  const developerScore = followersScore + starsScore + forksScore + longevityScore + reposScore;

  // Assigning professional rank tiers
  let developerRank = 'Code Novice';
  if (developerScore >= 80) {
    developerRank = '10x Mythic Developer';
  } else if (developerScore >= 60) {
    developerRank = 'Elite Architect';
  } else if (developerScore >= 40) {
    developerRank = 'Rising Tech Lead';
  } else if (developerScore >= 20) {
    developerRank = 'Scrappy Builder';
  }

  return {
    totalStars,
    totalForks,
    accountAgeYears,
    topLanguage,
    mostStarredRepo: mostStarredRepo === 'None' ? null : mostStarredRepo,
    developerScore,
    developerRank,
    githubCreatedAt: profile.created_at
  };
}

module.exports = {
  calculateAccountAgeInYears,
  determineTopLanguage,
  analyzeDeveloperData
};

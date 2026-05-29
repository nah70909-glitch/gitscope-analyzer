/**
 * Clean Formatting Utilities for developer data points
 */

/**
 * Format numbers compactly (e.g., 1500 -> 1.5K)
 * @param {number} num 
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  const val = Math.abs(num);
  if (val >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (val >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Format Date strings nicely
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format KB repo sizes to human readable format (MB, KB)
 * @param {number} kb 
 * @returns {string}
 */
export function formatSize(kb) {
  if (!kb) return '0 KB';
  if (kb >= 1024 * 1024) {
    return (kb / (1024 * 1024)).toFixed(1) + ' GB';
  }
  if (kb >= 1024) {
    return (kb / 1024).toFixed(1) + ' MB';
  }
  return kb.toLocaleString() + ' KB';
}

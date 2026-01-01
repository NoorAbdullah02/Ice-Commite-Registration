/**
 * Frontend Configuration
 * Detects environment and sets appropriate API URL
 */

// Determine API URL based on environment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000'  // Local development
  : (window.__ENV__?.API_URL || 'https://ice-commite-registration.onrender.com');  // Production

console.log('🌍 Environment Detected:', window.location.hostname);
console.log('📡 Using API URL:', API_URL);
https://ice-commite-registration.onrender.com/
// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_URL };
}

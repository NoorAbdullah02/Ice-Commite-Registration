// Ei file admin login handle kore

// API Configuration - Auto-detect environment
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'  // Development
  : 'https://ice-commite-registration.onrender.com';  // Production

console.log('🌐 API URL:', API_URL);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Show loader
  const loaderDiv = document.createElement('div');
  loaderDiv.id = 'loaderOverlay';
  loaderDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
  loaderDiv.innerHTML = '<div class="loader-container"><div class="spinner"></div><p>Logging in...</p></div>';
  document.body.appendChild(loaderDiv);
  
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Cookies include kore
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showMessage('✅ Login successful! Redirecting...', 'success');
      setTimeout(() => {
        loaderDiv.remove();
        window.location.href = '/admin.html';
      }, 1000);
    } else {
      showMessage(`❌ Error: ${data.error}`, 'error');
      loaderDiv.remove();
    }
  } catch (error) {
    showMessage(`❌ Login failed: ${error.message}`, 'error');
    loaderDiv.remove();
  }
});

function showMessage(message, type) {
  const container = document.getElementById('messageContainer');
  const className = type === 'error' ? 'error-message' : 'success-message';
  container.innerHTML = `<div class="${className}">${message}</div>`;
}
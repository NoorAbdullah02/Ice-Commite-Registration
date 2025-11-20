 
   // API Configuration
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isDevelopment 
      ? 'http://localhost:5000'
      : 'https://ice-commite-registration.onrender.com';
    
    console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
    console.log('🌐 API URL:', API_URL);

    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      
      // Update icon
      if (type === 'text') {
        eyeIcon.innerHTML = `
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        `;
      }
    });

    // Copy demo credentials on click
    document.getElementById('demoUsername').addEventListener('click', function() {
      document.getElementById('username').value = this.textContent;
      showTooltip(this, 'Copied!');
    });

    document.getElementById('demoPassword').addEventListener('click', function() {
      document.getElementById('password').value = this.textContent;
      showTooltip(this, 'Copied!');
    });

    function showTooltip(element, message) {
      const tooltip = document.createElement('div');
      tooltip.textContent = message;
      tooltip.style.cssText = `
        position: absolute;
        background: #1e293b;
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: fadeOut 1.5s ease-in-out;
      `;
      
      const rect = element.getBoundingClientRect();
      tooltip.style.top = (rect.top - 35) + 'px';
      tooltip.style.left = (rect.left + rect.width / 2 - 30) + 'px';
      
      document.body.appendChild(tooltip);
      
      setTimeout(() => {
        tooltip.remove();
      }, 1500);
    }

    // Form submission
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      
      // Validation
      if (!username || !password) {
        showMessage('⚠️ Please fill in all fields', 'error');
        return;
      }
      
      // Show loader
      const loaderDiv = document.createElement('div');
      loaderDiv.id = 'loaderOverlay';
      loaderDiv.innerHTML = `
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Logging in...</p>
        </div>
      `;
      document.body.appendChild(loaderDiv);
      
      try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          showMessage('✅ Login successful! Redirecting...', 'success');
          setTimeout(() => {
            loaderDiv.remove();
            window.location.href = '/admin.html';
          }, 1200);
        } else {
          showMessage(`❌ ${data.error || 'Invalid credentials'}`, 'error');
          loaderDiv.remove();
          
          // Shake animation on error
          document.querySelector('.login-container').style.animation = 'shake 0.5s';
          setTimeout(() => {
            document.querySelector('.login-container').style.animation = '';
          }, 500);
        }
      } catch (error) {
        console.error('Login error:', error);
        showMessage(`❌ Connection error: ${error.message}`, 'error');
        loaderDiv.remove();
      }
    });

    function showMessage(message, type) {
      const container = document.getElementById('messageContainer');
      const className = type === 'error' ? 'error-message' : 'success-message';
      const icon = type === 'error' 
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
      
      container.innerHTML = `
        <div class="${className}">
          ${icon}
          ${message}
        </div>
      `;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        container.innerHTML = '';
      }, 5000);
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
      
      @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);

    // Prevent form resubmission on page reload
    if (window.history.replaceState) {
      window.history.replaceState(null, null, window.location.href);
    }

    // Add keyboard shortcut (Enter to submit)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName === 'INPUT') {
          e.preventDefault();
          document.getElementById('loginForm').dispatchEvent(new Event('submit'));
        }
      }
    });

    // Focus management
    window.addEventListener('load', () => {
      document.getElementById('username').focus();
    });

    // Add visual feedback for input focus
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
      });
    });
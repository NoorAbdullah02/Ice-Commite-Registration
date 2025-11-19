// ============================================
// ICE COMMITTEE 2025 - JAVASCRIPT
// ============================================

// API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://ice-commite-registration.onrender.com';

console.log('🚀 ICE Committee 2025 - Initialized');
console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔗 API URL:', API_URL);

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  initializeHeroAnimations();
  initializeFormAnimations();
  initializePhotoUpload();
  initializeFormValidation();
  initializeFormSubmission();
  console.log('✅ All systems initialized');
});

// ============================================
// HEADER FUNCTIONALITY
// ============================================
function initializeHeader() {
  const header = document.querySelector('.header-2025');
  const mobileToggle = document.getElementById('mobileToggle');
  
  // Scroll effect for header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.padding = '1rem 0';
      header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.padding = '1.5rem 0';
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      // Add mobile menu functionality here if needed
    });
  }
}

// ============================================
// HERO ANIMATIONS
// ============================================
function initializeHeroAnimations() {
  // Parallax effect for hero
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-2025');
    
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.4}px)`;
      hero.style.opacity = 1 - (scrolled / 800);
    }
  });
  
  // Animate title words sequentially
  const titleWords = document.querySelectorAll('.title-word');
  titleWords.forEach((word, index) => {
    word.style.animationDelay = `${0.2 + index * 0.2}s`;
  });
}

// ============================================
// FORM ANIMATIONS
// ============================================
function initializeFormAnimations() {
  // Intersection Observer for form elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all input groups
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach((group, index) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(30px)';
    group.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(group);
  });
  
  // Input focus effects
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
      
      // Add glow effect
      const inputContainer = this.closest('.input-container');
      if (inputContainer) {
        inputContainer.style.transition = 'all 0.3s ease';
      }
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
    
    // Real-time validation styling
    input.addEventListener('input', function() {
      if (this.value.length > 0 && this.checkValidity()) {
        this.style.borderColor = 'var(--success)';
      } else if (this.value.length > 0) {
        this.style.borderColor = 'var(--error)';
      } else {
        this.style.borderColor = 'transparent';
      }
    });
  });
}

// ============================================
// PHOTO UPLOAD
// ============================================
function initializePhotoUpload() {
  const photoInput = document.getElementById('photo');
  const uploadArea = document.getElementById('uploadArea');
  const photoPreview = document.getElementById('photoPreview');
  
  if (!photoInput || !uploadArea) return;
  
  // File input change
  photoInput.addEventListener('change', handlePhotoSelect);
  
  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
    uploadArea.style.transform = 'scale(1.05)';
    uploadArea.style.boxShadow = '0 16px 48px rgba(102, 126, 234, 0.2)';
  });
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#cbd5e0';
    uploadArea.style.transform = 'scale(1)';
    uploadArea.style.boxShadow = 'none';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#cbd5e0';
    uploadArea.style.transform = 'scale(1)';
    uploadArea.style.boxShadow = 'none';
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      photoInput.files = e.dataTransfer.files;
      previewPhoto(file);
    } else {
      showMessage('⚠️ Please upload a JPG or PNG image', 'error');
    }
  });
  
  function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 3 * 1024 * 1024) {
        showMessage('⚠️ Photo size must be less than 3MB', 'error');
        photoInput.value = '';
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        showMessage('⚠️ Only JPG and PNG files are allowed', 'error');
        photoInput.value = '';
        return;
      }
      
      previewPhoto(file);
    }
  }
  
  function previewPhoto(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.style.display = 'block';
      
      // Hide upload content
      const uploadVisual = uploadArea.querySelector('.upload-visual');
      if (uploadVisual) {
        uploadVisual.style.display = 'none';
      }
      
      // Add success border
      uploadArea.style.borderColor = 'var(--success)';
    };
    
    reader.readAsDataURL(file);
  }
}

// ============================================
// FORM VALIDATION
// ============================================
function initializeFormValidation() {
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  
  // Email validation
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = 'var(--error)';
        showMessage('⚠️ Please enter a valid email address', 'error');
      } else if (this.value) {
        this.style.borderColor = 'var(--success)';
      }
    });
  }
  
  // Phone validation
  if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
      if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = 'var(--error)';
        showMessage('⚠️ Please enter a valid phone number (e.g., 01748269350)', 'error');
      } else if (this.value) {
        this.style.borderColor = 'var(--success)';
      }
    });
  }
  
  // Character counter for note
  const noteTextarea = document.getElementById('note');
  if (noteTextarea) {
    const counterDiv = document.createElement('div');
    counterDiv.style.cssText = `
      text-align: right;
      font-size: 0.875rem;
      color: #64748b;
      margin-top: 0.5rem;
      font-weight: 500;
    `;
    noteTextarea.parentElement.appendChild(counterDiv);
    
    noteTextarea.addEventListener('input', function() {
      const count = this.value.length;
      const max = 500;
      counterDiv.textContent = `${count}/${max} characters`;
      
      if (count > max) {
        this.value = this.value.substring(0, max);
        counterDiv.style.color = 'var(--error)';
      } else {
        counterDiv.style.color = '#64748b';
      }
    });
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Allow BD phone numbers: 01XXXXXXXXX or +8801XXXXXXXXX
  const cleanPhone = phone.replace(/[\s-]/g, '');
  const re = /^(?:\+880|0)1[0-9]{9}$/;
  return re.test(cleanPhone);
}

// ============================================
// FORM SUBMISSION
// ============================================
function initializeFormSubmission() {
  const form = document.getElementById('registrationForm');
  
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = '';
    
    // Show loader
    const loaderContainer = document.getElementById('loaderContainer');
    const submitBtn = document.getElementById('submitBtn');
    
    loaderContainer.style.display = 'block';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';
    
    // Validate all fields
    if (!validateForm()) {
      hideLoader();
      return;
    }
    
    try {
      console.log('📝 Starting registration process...');
      
      // Upload photo first
      const photoFile = document.getElementById('photo').files[0];
      console.log('📸 Uploading photo:', photoFile.name);
      const photoUrl = await uploadPhoto(photoFile);
      console.log('✅ Photo uploaded:', photoUrl);
      
      // Collect form data
      const formData = {
        full_name: document.getElementById('full_name').value.trim(),
        ID_no: document.getElementById('ID_no').value.trim(),
        batch: document.getElementById('batch').value,
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value,
        gender: document.getElementById('gender').value || 'Not specified',
        apply_for_post: document.getElementById('apply_for_post').value,
        photo_url: photoUrl,
        note: document.getElementById('note').value.trim()
      };
      
      console.log('📤 Submitting registration...');
      
      // Submit registration
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log('📥 Response received:', data);
      
      if (response.ok) {
        // Store data for success page
        sessionStorage.setItem('registrationData', JSON.stringify(formData));
        
        showMessage('✅ Registration successful! Redirecting...', 'success');
        
        // Add celebration effect
        createConfetti();
        
        // Redirect after delay
        setTimeout(() => {
          hideLoader();
          window.location.href = '/success.html';
        }, 2000);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      showMessage(`❌ Registration failed: ${error.message}`, 'error');
      hideLoader();
    }
  });
}

function validateForm() {
  const photoFile = document.getElementById('photo').files[0];
  
  if (!photoFile) {
    showMessage('⚠️ Please select a profile photo', 'error');
    return false;
  }
  
  if (photoFile.size > 3 * 1024 * 1024) {
    showMessage('⚠️ Photo size must be less than 3MB', 'error');
    return false;
  }
  
  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = photoFile.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(fileExtension)) {
    showMessage('⚠️ Only JPG and PNG files are allowed', 'error');
    return false;
  }
  
  const phone = document.getElementById('phone').value.trim();
  if (!validatePhone(phone)) {
    showMessage('⚠️ Please enter a valid phone number', 'error');
    return false;
  }
  
  const email = document.getElementById('email').value.trim();
  if (!validateEmail(email)) {
    showMessage('⚠️ Please enter a valid email address', 'error');
    return false;
  }
  
  return true;
}

async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  
  console.log('📸 Uploading to:', `${API_URL}/api/upload`);
  
  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data.url;
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error(`Photo upload failed: ${error.message}`);
  }
}

// ============================================
// UI HELPERS
// ============================================
function showMessage(message, type) {
  const container = document.getElementById('messageContainer');
  const className = type === 'error' ? 'error-message' : 'success-message';
  const icon = type === 'error' ? '❌' : '✅';
  
  container.innerHTML = `
    <div class="${className}">
      <span style="font-size: 1.5rem;">${icon}</span>
      <span>${message}</span>
    </div>
  `;
  
  // Smooth scroll to message
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Auto-hide success messages
  if (type === 'success') {
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }
}

function hideLoader() {
  const loaderContainer = document.getElementById('loaderContainer');
  const submitBtn = document.getElementById('submitBtn');
  
  loaderContainer.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';
}

// ============================================
// CONFETTI EFFECT
// ============================================
function createConfetti() {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}vw;
      opacity: ${Math.random()};
      transform: rotate(${Math.random() * 360}deg);
      animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
  }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
  @keyframes confettiFall {
    to {
      transform: translateY(100vh) rotate(${Math.random() * 720}deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

console.log('🎉 ICE Committee 2025 - Ready!');
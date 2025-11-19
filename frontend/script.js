// ============================================
// ICE COMMITTEE 2025 - OPTIMIZED JAVASCRIPT
// ============================================

// API Configuration
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000'
  : 'https://ice-commite-registration.onrender.com';

console.log('🚀 ICE Committee 2025 - Initialized');
console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🔗 API URL:', API_URL);

// Performance optimization - Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  
  if (!header) return;
  
  // Optimized scroll effect for header
  let lastScroll = 0;
  let ticking = false;
  
  const updateHeader = () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
      header.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.1)';
    } else {
      header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.02)';
    }
    
    lastScroll = currentScroll;
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  
  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      const spans = mobileToggle.querySelectorAll('span');
      
      if (mobileToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
}

// ============================================
// HERO ANIMATIONS - OPTIMIZED
// ============================================
function initializeHeroAnimations() {
  if (prefersReducedMotion) return;
  
  const hero = document.querySelector('.hero-2025');
  if (!hero) return;
  
  let ticking = false;
  
  // Optimized parallax effect
  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    
    if (scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.3}px)`;
      hero.style.opacity = Math.max(1 - (scrolled / 600), 0);
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking && window.innerWidth > 768) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// FORM ANIMATIONS - OPTIMIZED
// ============================================
function initializeFormAnimations() {
  // Intersection Observer for form elements
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);
  
  // Observe all input groups
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach((group, index) => {
    if (!prefersReducedMotion) {
      group.style.opacity = '0';
      group.style.transform = 'translateY(20px)';
      group.style.transition = `all 0.5s ease ${index * 0.08}s`;
    }
    observer.observe(group);
  });
  
  // Input focus effects - optimized
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Focus effect
    input.addEventListener('focus', function() {
      this.setAttribute('data-focused', 'true');
    });
    
    input.addEventListener('blur', function() {
      this.removeAttribute('data-focused');
    });
    
    // Real-time validation styling with debounce
    const validateInput = debounce(function() {
      if (this.value.length > 0) {
        if (this.checkValidity()) {
          this.style.borderColor = '#10b981';
        } else {
          this.style.borderColor = '#ef4444';
        }
      } else {
        this.style.borderColor = '#e2e8f0';
      }
    }, 300);
    
    input.addEventListener('input', validateInput);
  });
}

// ============================================
// PHOTO UPLOAD - IMPROVED
// ============================================
function initializePhotoUpload() {
  const photoInput = document.getElementById('photo');
  const uploadArea = document.getElementById('uploadArea');
  const photoPreview = document.getElementById('photoPreview');
  
  if (!photoInput || !uploadArea) return;
  
  // File input change
  photoInput.addEventListener('change', handlePhotoSelect);
  
  // Drag and drop - with better visual feedback
  let dragCounter = 0;
  
  uploadArea.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    uploadArea.style.borderColor = '#6366f1';
    uploadArea.style.transform = 'scale(1.02)';
    uploadArea.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.2)';
  });
  
  uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      uploadArea.style.borderColor = '#cbd5e0';
      uploadArea.style.transform = 'scale(1)';
      uploadArea.style.boxShadow = 'none';
    }
  });
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    uploadArea.style.borderColor = '#cbd5e0';
    uploadArea.style.transform = 'scale(1)';
    uploadArea.style.boxShadow = 'none';
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      // Create a new FileList-like object
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInput.files = dataTransfer.files;
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
      
      // Add success styling
      uploadArea.style.borderColor = '#10b981';
      uploadArea.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
    };
    
    reader.onerror = () => {
      showMessage('⚠️ Failed to read the image file', 'error');
    };
    
    reader.readAsDataURL(file);
  }
}

// ============================================
// FORM VALIDATION - ENHANCED
// ============================================
function initializeFormValidation() {
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  
  // Email validation with debounce
  if (emailInput) {
    const validateEmailInput = debounce(function() {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#ef4444';
      } else if (this.value) {
        this.style.borderColor = '#10b981';
      }
    }, 500);
    
    emailInput.addEventListener('input', validateEmailInput);
  }
  
  // Phone validation with debounce
  if (phoneInput) {
    const validatePhoneInput = debounce(function() {
      if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = '#ef4444';
      } else if (this.value) {
        this.style.borderColor = '#10b981';
      }
    }, 500);
    
    phoneInput.addEventListener('input', validatePhoneInput);
  }
  
  // Character counter for note
  const noteTextarea = document.getElementById('note');
  if (noteTextarea) {
    const counterDiv = document.createElement('div');
    counterDiv.style.cssText = `
      text-align: right;
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 0.5rem;
      font-weight: 600;
    `;
    noteTextarea.parentElement.appendChild(counterDiv);
    
    const updateCounter = () => {
      const count = noteTextarea.value.length;
      const max = 500;
      counterDiv.textContent = `${count}/${max} characters`;
      
      if (count > max) {
        noteTextarea.value = noteTextarea.value.substring(0, max);
        counterDiv.style.color = '#ef4444';
      } else if (count > max * 0.9) {
        counterDiv.style.color = '#f59e0b';
      } else {
        counterDiv.style.color = '#94a3b8';
      }
    };
    
    noteTextarea.addEventListener('input', updateCounter);
    updateCounter(); // Initialize
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
// FORM SUBMISSION - IMPROVED ERROR HANDLING
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
    submitBtn.style.cursor = 'not-allowed';
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Validate all fields
    const validation = validateForm();
    if (!validation.isValid) {
      showMessage(validation.message, 'error');
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
      
      // Submit registration with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await response.json();
      console.log('📥 Response received:', data);
      
      if (response.ok) {
        // Store data for success page
        sessionStorage.setItem('registrationData', JSON.stringify(formData));
        
        showMessage('✅ Registration successful! Redirecting...', 'success');
        
        // Add celebration effect
        if (!prefersReducedMotion) {
          createConfetti();
        }
        
        // Redirect after delay
        setTimeout(() => {
          hideLoader();
          window.location.href = '/success.html';
        }, 2000);
      } else {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      let errorMessage = '❌ Registration failed. ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please check your internet connection and try again.';
      } else if (!navigator.onLine) {
        errorMessage += 'No internet connection. Please check your network and try again.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }
      
      showMessage(errorMessage, 'error');
      hideLoader();
    }
  });
}

function validateForm() {
  const photoFile = document.getElementById('photo').files[0];
  
  if (!photoFile) {
    return { isValid: false, message: '⚠️ Please select a profile photo' };
  }
  
  if (photoFile.size > 3 * 1024 * 1024) {
    return { isValid: false, message: '⚠️ Photo size must be less than 3MB' };
  }
  
  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = photoFile.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(fileExtension)) {
    return { isValid: false, message: '⚠️ Only JPG and PNG files are allowed' };
  }
  
  const phone = document.getElementById('phone').value.trim();
  if (!validatePhone(phone)) {
    return { isValid: false, message: '⚠️ Please enter a valid phone number (e.g., 01748269350)' };
  }
  
  const email = document.getElementById('email').value.trim();
  if (!validateEmail(email)) {
    return { isValid: false, message: '⚠️ Please enter a valid email address' };
  }
  
  const fullName = document.getElementById('full_name').value.trim();
  if (fullName.length < 3) {
    return { isValid: false, message: '⚠️ Please enter your full name (at least 3 characters)' };
  }
  
  const idNo = document.getElementById('ID_no').value.trim();
  if (idNo.length < 3) {
    return { isValid: false, message: '⚠️ Please enter a valid ID number' };
  }
  
  return { isValid: true };
}

async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);
  
  console.log('📸 Uploading to:', `${API_URL}/api/upload`);
  
  try {
    // Add timeout for upload
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for upload
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    
    if (response.ok) {
      return data.url;
    } else {
      throw new Error(data.error || 'Upload failed');
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Photo upload timed out. Please try with a smaller image.');
    }
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
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
  
  // Auto-hide messages after 8 seconds
  setTimeout(() => {
    if (container.innerHTML) {
      container.style.opacity = '0';
      container.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        container.innerHTML = '';
        container.style.opacity = '1';
      }, 500);
    }
  }, 8000);
}

function hideLoader() {
  const loaderContainer = document.getElementById('loaderContainer');
  const submitBtn = document.getElementById('submitBtn');
  
  loaderContainer.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';
  submitBtn.style.cursor = 'pointer';
}

// ============================================
// CONFETTI EFFECT - OPTIMIZED
// ============================================
function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  const confettiCount = window.innerWidth < 768 ? 30 : 50; // Less on mobile
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 8 + 4;
    
    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}vw;
      opacity: ${Math.random() * 0.8 + 0.2};
      border-radius: 50%;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      z-index: 9999;
      pointer-events: none;
      will-change: transform, opacity;
    `;
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 4500);
  }
}

// Add confetti animation
if (!document.getElementById('confetti-styles')) {
  const style = document.createElement('style');
  style.id = 'confetti-styles';
  style.textContent = `
    @keyframes confettiFall {
      to {
        transform: translateY(100vh) rotate(${Math.random() * 720}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

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

// ============================================
// NETWORK STATUS INDICATOR
// ============================================
window.addEventListener('online', () => {
  console.log('✅ Network connection restored');
});

window.addEventListener('offline', () => {
  console.log('⚠️ Network connection lost');
  showMessage('⚠️ No internet connection. Please check your network.', 'error');
});

console.log('🎉 ICE Committee 2025 - Ready!');
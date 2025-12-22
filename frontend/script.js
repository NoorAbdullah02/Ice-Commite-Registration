// API Configuration - Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000'  // Development
  : 'https://ice-commite-registration.onrender.com';  // Production

console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🌐 Hostname:', window.location.hostname);
console.log('🌐 API URL:', API_URL);

// Initialize particles on page load
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initializeFormAnimations();
  initializeMobileMenu();
});

// Create floating particles
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  // Skip if particles container doesn't exist (it's optional)
  if (!particlesContainer) {
    console.log('✅ Particles container not needed on this page');
    return;
  }
  
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    
    particlesContainer.appendChild(particle);
  }
}

// Initialize form animations
function initializeFormAnimations() {
  const formGroups = document.querySelectorAll('.form-group');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, { threshold: 0.1 });

  formGroups.forEach(group => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    group.style.transition = 'all 0.5s ease';
    observer.observe(group);
  });
}

// Mobile menu toggle
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}

// Photo upload handling
const photoInput = document.getElementById('photo');
const photoUploadArea = document.getElementById('uploadArea');
const photoPreview = document.getElementById('photoPreview');

photoInput.addEventListener('change', handlePhotoSelect);

function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (file) {
    previewPhoto(file);
  }
}

function previewPhoto(file) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    photoPreview.src = e.target.result;
    photoPreview.style.display = 'block';
    
    // Hide upload content
    const uploadContent = photoUploadArea.querySelector('.upload-visual');
    if (uploadContent) {
      uploadContent.style.display = 'none';
    }
    
    // Add animation
    photoPreview.style.animation = 'scaleIn 0.5s ease-out';
  };
  
  reader.readAsDataURL(file);
}

// Drag and drop functionality
photoUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  photoUploadArea.style.borderColor = '#667eea';
  photoUploadArea.style.background = '#edf2f7';
  photoUploadArea.style.transform = 'scale(1.02)';
});

photoUploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  photoUploadArea.style.borderColor = '#cbd5e0';
  photoUploadArea.style.background = '#f7fafc';
  photoUploadArea.style.transform = 'scale(1)';
});

photoUploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  photoUploadArea.style.borderColor = '#cbd5e0';
  photoUploadArea.style.background = '#f7fafc';
  photoUploadArea.style.transform = 'scale(1)';
  
  const file = e.dataTransfer.files[0];
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    photoInput.files = e.dataTransfer.files;
    previewPhoto(file);
  } else {
    showMessage('⚠️ Please upload a JPG or PNG image', 'error');
  }
});

// Form input animations
const inputs = document.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
  // Add focus animation
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-2px)';
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateY(0)';
  });
  
  // Add typing effect for text inputs
  if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
    input.addEventListener('input', function() {
      if (this.value.length > 0) {
        this.style.borderColor = '#667eea';
      } else {
        this.style.borderColor = '#e2e8f0';
      }
    });
  }
});

// Form submission
const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = '';

  // Show loader
  const loaderContainer = document.getElementById('loaderContainer');
  loaderContainer.style.display = 'block';
  
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.6';

  // Validate photo
  const photoFile = photoInput.files[0];
  if (!photoFile) {
    showMessage('⚠️ Please select a profile photo', 'error');
    hideLoader();
    return;
  }

  // Check file size (3MB)
  if (photoFile.size > 3 * 1024 * 1024) {
    showMessage('⚠️ Photo size must be less than 3MB', 'error');
    hideLoader();
    return;
  }

  // Check file type
  const validExtensions = ['jpg', 'jpeg', 'png'];
  const fileExtension = photoFile.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(fileExtension)) {
    showMessage('⚠️ Only JPG and PNG files are allowed', 'error');
    hideLoader();
    return;
  }

  // Validate phone number
  const phone = document.getElementById('phone').value.trim();
  // Allow BD phone numbers: 01XXXXXXXXX (11 digits) or +8801XXXXXXXXX
  const phoneRegex = /^(?:\+880|0)1[0-9]{9}$/;
  if (!phoneRegex.test(phone.replace(/\s|-/g, ''))) {
    showMessage('⚠️ Please enter a valid phone number (e.g., 01748269350 or +8801748269350)', 'error');
    hideLoader();
    return;
  }

  try {
    console.log('Starting registration process...');
    
    // Upload photo first
    console.log('Uploading photo...');
    const photoUrl = await uploadPhoto(photoFile);
    console.log('Photo uploaded successfully:', photoUrl);
    
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

    console.log('📝 Form Data to Submit:', formData);
    const registrationUrl = `${API_URL}/api/register/register`;
    console.log('🚀 FULL URL TO SUBMIT:', registrationUrl);
    console.log('🚀 Submitting to endpoint: /api/register/register');

    // Submit registration
    const response = await fetch(registrationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    const data = await response.json();
    console.log('📦 Registration response:', data);
    console.log('📦 Full response object:', JSON.stringify(data, null, 2));

    if (response.ok) {
      // Store data for success page
      sessionStorage.setItem('registrationData', JSON.stringify(formData));
      
      showMessage('✅ Registration successful! Redirecting...', 'success');
      
      // Redirect after delay
      setTimeout(() => {
        hideLoader();
        window.location.href = '/success.html';
      }, 2000);
    } else {
      const errorMsg = data.error || data.message || 'Registration failed';
      const fullError = `Status ${response.status}: ${errorMsg}`;
      console.error('❌ Registration Error:', fullError);
      showMessage(`❌ Error: ${fullError}`, 'error');
      hideLoader();
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    showMessage(`❌ Registration failed: ${error.message}`, 'error');
    hideLoader();
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }
});

// Upload photo to server
async function uploadPhoto(file) {
  const formData = new FormData();
  formData.append('photo', file);

  const uploadUrl = `${API_URL}/api/upload`;
  console.log('📸 Uploading photo to:', uploadUrl);
  console.log('📄 File:', file.name, file.size, file.type);

  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    console.log('✅ Upload response status:', response.status);
    console.log('✅ Upload response statusText:', response.statusText);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    console.log('📦 Full response:', JSON.stringify(data, null, 2));
    console.log('📦 Data keys:', Object.keys(data));

    if (response.ok) {
      // Try multiple ways to get the URL
      let photoUrl = data.url || data.image?.url || data.secure_url;
      
      console.log('🔍 Extracted photoUrl:', photoUrl);
      console.log('🔍 data.url:', data.url);
      console.log('🔍 data.image:', data.image);
      
      if (!photoUrl) {
        console.error('❌ No photo URL in response:', data);
        console.error('❌ Response structure:', JSON.stringify(data, null, 2));
        throw new Error(`No photo URL returned from server. Response: ${JSON.stringify(data)}`);
      }
      
      console.log('✅ Photo uploaded successfully:', photoUrl);
      
      // Validate the URL is accessible
      if (!photoUrl.startsWith('http')) {
        console.error('❌ Invalid URL format:', photoUrl);
        throw new Error(`Invalid photo URL format: ${photoUrl}`);
      }
      
      return photoUrl;
    } else {
      const errorMsg = data.error || `Upload failed with status ${response.status}`;
      console.error('❌ Upload failed:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('❌ Photo upload error:', error);
    console.error('❌ Error message:', error.message);
    throw new Error(`Photo upload failed: ${error.message}`);
  }
}

// Show message with animation
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
}

// Hide loader and enable submit button
function hideLoader() {
  const loaderContainer = document.getElementById('loaderContainer');
  const submitBtn = document.getElementById('submitBtn');
  
  loaderContainer.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';
}

// Smooth scroll for navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      console.log('Navigation clicked:', href);
      // Can be expanded for actual section navigation
    }
  });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroContent = document.querySelector('.hero-content');
  
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    heroContent.style.opacity = 1 - scrolled / 500;
  }
});

// Form validation with real-time feedback
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^01[3-9]\d{8}$/;
return re.test(phone.replace(/[\s-]/g, ''));
  
}

// Real-time email validation
document.getElementById('email').addEventListener('blur', function() {
  if (this.value && !validateEmail(this.value)) {
    this.style.borderColor = '#ef4444';
    showMessage('⚠️ Please enter a valid email address', 'error');
  } else {
    this.style.borderColor = '#10b981';
  }
});

// Real-time phone validation
document.getElementById('phone').addEventListener('blur', function() {
  if (this.value && !validatePhone(this.value)) {
    this.style.borderColor = '#ef4444';
    showMessage('⚠️ Please enter a valid phone number', 'error');
  } else {
    this.style.borderColor = '#10b981';
  }
});

// Add loading animation to submit button
const submitBtn = document.getElementById('submitBtn');
let originalBtnText = '';

if (submitBtn) {
  submitBtn.addEventListener('click', function(e) {
    if (!this.disabled) {
      // Get text from button-text span instead of btn-text
      const btnTextSpan = this.querySelector('.button-text');
      if (btnTextSpan) {
        originalBtnText = btnTextSpan.textContent;
      }
    }
  });
}

// Character counter for note textarea
const noteTextarea = document.getElementById('note');
if (noteTextarea) {
  const counterDiv = document.createElement('div');
  counterDiv.style.cssText = 'text-align: right; font-size: 0.875rem; color: #718096; margin-top: 0.5rem;';
  noteTextarea.parentElement.appendChild(counterDiv);
  
  noteTextarea.addEventListener('input', function() {
    const count = this.value.length;
    const max = 500;
    counterDiv.textContent = `${count}/${max} characters`;
    
    if (count > max) {
      this.value = this.value.substring(0, max);
      counterDiv.style.color = '#ef4444';
    } else {
      counterDiv.style.color = '#718096';
    }
  });
}

// Add ripple effect to buttons
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    left: ${x}px;
    top: ${y}px;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  `;
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// Add ripple to all buttons
document.querySelectorAll('button, .social-link').forEach(button => {
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.addEventListener('click', createRipple);
});

// Add CSS animation for ripple
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('ICE Committee Registration Form - Initialized Successfully! 🎉');
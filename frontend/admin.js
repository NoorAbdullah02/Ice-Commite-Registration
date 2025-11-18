// Admin Dashboard JavaScript
// Manages all admin functionality

// API Configuration - Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000'  // Development
  : 'https://ice-commite-registration.onrender.com';  // Production

console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🌐 Hostname:', window.location.hostname);
console.log('🌐 API URL:', API_URL);



let allStudents = [];
let studentToDelete = null;
let studentToEditPost = null;

// Load students when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
  // Auto-refresh every 10 seconds
  setInterval(loadStudents, 10000);
});

// Load students from API
async function loadStudents() {
  try {
    const response = await fetch(`${API_URL}/api/students`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.status === 401) {
      window.location.href = '/login.html';
      return;
    }

    const data = await response.json();

    if (data.success) {
      allStudents = data.students;
      
      // Update stats with animation
      animateNumber('totalCount', data.stats.total);
      animateNumber('selectedCount', data.stats.selected);
      animateNumber('pendingCount', data.stats.pending);

      // Display students in table
      displayStudents(allStudents);
    }
  } catch (error) {
    showMessage(`❌ Failed to load students: ${error.message}`, 'error');
  }
}

// Animate number counting
function animateNumber(elementId, targetNumber) {
  const element = document.getElementById(elementId);
  const currentNumber = parseInt(element.textContent) || 0;
  const increment = targetNumber > currentNumber ? 1 : -1;
  const duration = 500;
  const steps = Math.abs(targetNumber - currentNumber);
  const stepDuration = steps > 0 ? duration / steps : 0;

  let current = currentNumber;
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    
    if ((increment > 0 && current >= targetNumber) || (increment < 0 && current <= targetNumber)) {
      element.textContent = targetNumber;
      clearInterval(timer);
    }
  }, stepDuration);
}

// Display students in table
function displayStudents(students) {
  const tbody = document.getElementById('tableBody');
  
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;"><div style="color: #94a3b8; font-size: 16px;">📭 No students found</div></td></tr>';
    return;
  }

  tbody.innerHTML = students.map(student => `
    <tr>
      <td>
        <img src="${student.photo_url}" alt="Photo" class="photo-thumb" onclick="viewPhoto('${student.id}', '${student.photo_url}')">
      </td>
      <td><strong>${escapeHtml(student.full_name)}</strong></td>
      <td>${escapeHtml(student.ID_no)}</td>
      <td>${student.batch ? `<span style="background: linear-gradient(135deg, #e0e7ff, #c7d2fe); padding: 4px 12px; border-radius: 6px; font-weight: 600; color: #4338ca;">Batch ${escapeHtml(student.batch)}</span>` : 'N/A'}</td>
      <td>${escapeHtml(student.email)}</td>
      <td><strong>${escapeHtml(student.apply_for_post)}</strong></td>
      <td>
        <span class="badge ${student.selected ? 'selected' : 'pending'}">
          ${student.selected ? '✓ Selected' : '⏳ Pending'}
        </span>
      </td>
      <td style="white-space: nowrap;">
        <button class="button" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 8px 14px; font-size: 12px;" onclick="editPostModal('${student.id}', '${student.full_name}', '${student.apply_for_post}')">✏️ Edit</button>
        ${!student.selected ? `
          <button class="button success" onclick="selectStudent('${student.id}', '${escapeHtml(student.full_name)}')">✓ Select</button>
        ` : ''}
        <button class="button danger" onclick="deleteStudent('${student.id}')">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

// Filter students based on search and filters
function filterStudents() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const post = document.getElementById('postFilter').value;
  const status = document.getElementById('statusFilter').value;
  const batch = document.getElementById('batchFilter').value;

  const filtered = allStudents.filter(student => {
    const matchSearch = !search || 
      student.full_name.toLowerCase().includes(search) || 
      student.email.toLowerCase().includes(search) ||
      student.ID_no.toLowerCase().includes(search);
    
    const matchPost = !post || student.apply_for_post === post;
    
    const matchStatus = !status || 
      (status === 'selected' && student.selected) || 
      (status === 'pending' && !student.selected);
    
    const matchBatch = !batch || (student.batch && student.batch.toString() === batch);

    return matchSearch && matchPost && matchStatus && matchBatch;
  });

  displayStudents(filtered);
}

// Select student and send email
async function selectStudent(studentId, studentName) {
  if (!confirm(`Are you sure you want to select ${studentName}?`)) return;

  showLoader('Processing selection...');

  try {
    const response = await fetch(`${API_URL}/api/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentId })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(`✅ ${studentName} has been selected! Confirmation email sent.`, 'success');
      loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showMessage(`❌ Failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Show delete confirmation modal
function deleteStudent(studentId) {
  studentToDelete = studentId;
  document.getElementById('deleteModal').classList.add('show');
}

// Confirm and delete student
async function confirmDelete() {
  if (!studentToDelete) return;

  showLoader('Deleting student...');

  try {
    const response = await fetch(`${API_URL}/api/select/${studentToDelete}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('✅ Student deleted successfully', 'success');
      closeDeleteModal();
      loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showMessage(`❌ Delete failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Close delete modal
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
  studentToDelete = null;
}

// View photo with details
function viewPhoto(id, photoUrl) {
  const student = allStudents.find(s => s.id === id);
  
  if (student) {
    document.getElementById('modalPhoto').src = photoUrl;
    document.getElementById('detailFullName').textContent = escapeHtml(student.full_name || '-');
    document.getElementById('detailID').textContent = escapeHtml(student.ID_no || '-');
    document.getElementById('detailBatch').textContent = student.batch ? `Batch ${escapeHtml(student.batch)}` : 'N/A';
    document.getElementById('detailEmail').textContent = escapeHtml(student.email || '-');
    document.getElementById('detailPhone').textContent = escapeHtml(student.phone || '-');
    document.getElementById('detailDept').textContent = escapeHtml(student.department || '-');
    document.getElementById('detailGender').textContent = escapeHtml(student.gender || 'Not specified');
    document.getElementById('detailPost').textContent = escapeHtml(student.apply_for_post || '-');
    document.getElementById('detailStatus').innerHTML = `<span class="badge ${student.selected ? 'selected' : 'pending'}">${student.selected ? '✓ Selected' : '⏳ Pending'}</span>`;
    document.getElementById('detailNote').textContent = escapeHtml(student.note || 'No note available');
  }
  
  resetZoom();
  document.getElementById('photoModal').classList.add('show');
}

// Close photo modal
function closeModal() {
  document.getElementById('photoModal').classList.remove('show');
  resetZoom();
}

// Show edit post modal
function editPostModal(studentId, studentName, currentPost) {
  studentToEditPost = { id: studentId, currentPost };
  document.getElementById('editStudentName').textContent = `Student: ${escapeHtml(studentName)} (Current Position: ${escapeHtml(currentPost)})`;
  document.getElementById('newPost').value = '';
  document.getElementById('editPostModal').classList.add('show');
}

// Close edit post modal
function closeEditPostModal() {
  document.getElementById('editPostModal').classList.remove('show');
  studentToEditPost = null;
}

// Confirm and update post
async function confirmEditPost() {
  if (!studentToEditPost) return;

  const newPost = document.getElementById('newPost').value;
  if (!newPost) {
    alert('Please select a position');
    return;
  }

  showLoader('Updating position...');

  try {
    const response = await fetch(`${API_URL}/api/update-post/${studentToEditPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ apply_for_post: newPost })
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(`✅ Position updated to ${newPost}! Email notification sent.`, 'success');
      closeEditPostModal();
      loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showMessage(`❌ Failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Logout user
async function logout() {
  if (!confirm('Are you sure you want to logout?')) return;

  try {
    await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    window.location.href = '/login.html';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = '/login.html';
  }
}

// Show message notification
function showMessage(message, type) {
  const container = document.getElementById('messageContainer');
  const className = type === 'error' ? 'error-message' : 'success-message';
  container.innerHTML = `<div class="${className}">${message}</div>`;
  
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Show loader overlay
function showLoader(message = 'Processing...') {
  const loaderDiv = document.createElement('div');
  loaderDiv.id = 'loaderOverlay';
  loaderDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999;';
  loaderDiv.innerHTML = `<div class="loader-container"><div class="spinner"></div><p>${message}</p></div>`;
  document.body.appendChild(loaderDiv);
}

// Hide loader overlay
function hideLoader() {
  const overlay = document.getElementById('loaderOverlay');
  if (overlay) overlay.remove();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Zoom functionality
let currentZoom = 100;
const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 20;

function zoomIn() {
  if (currentZoom < MAX_ZOOM) {
    currentZoom += ZOOM_STEP;
    applyZoom();
  }
}

function zoomOut() {
  if (currentZoom > MIN_ZOOM) {
    currentZoom -= ZOOM_STEP;
    applyZoom();
  }
}

function resetZoom() {
  currentZoom = 100;
  applyZoom();
}

function applyZoom() {
  const img = document.getElementById('modalPhoto');
  const container = document.getElementById('imageContainer');
  
  if (img) {
    img.style.transform = `scale(${currentZoom / 100})`;
    img.style.transformOrigin = 'center top';
    img.style.transition = 'transform 0.2s ease';
    
    document.getElementById('zoomLevel').textContent = currentZoom + '%';
    
    if (currentZoom > 100) {
      container.style.maxHeight = (currentZoom / 100) * 400 + 'px';
      container.style.overflow = 'auto';
    } else {
      container.style.maxHeight = 'auto';
      container.style.overflow = 'visible';
    }
  }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    if (document.getElementById('photoModal').classList.contains('show')) {
      closeModal();
    }
    if (document.getElementById('deleteModal').classList.contains('show')) {
      closeDeleteModal();
    }
    if (document.getElementById('editPostModal').classList.contains('show')) {
      closeEditPostModal();
    }
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // ESC key to close modals
  if (e.key === 'Escape') {
    if (document.getElementById('photoModal').classList.contains('show')) {
      closeModal();
    }
    if (document.getElementById('deleteModal').classList.contains('show')) {
      closeDeleteModal();
    }
    if (document.getElementById('editPostModal').classList.contains('show')) {
      closeEditPostModal();
    }
  }
  
  // Zoom controls when photo modal is open
  if (document.getElementById('photoModal').classList.contains('show')) {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomIn();
    }
    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomOut();
    }
    if (e.key === '0') {
      e.preventDefault();
      resetZoom();
    }
  }
});
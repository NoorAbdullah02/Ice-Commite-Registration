// Admin Dashboard JavaScript - Fixed Version
// Manages all admin functionality

// API Configuration - Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment 
  ? 'http://localhost:5000'  // Development
  : 'https://ice-commite-registration.onrender.com';  // Production

console.log('🌐 Environment:', isDevelopment ? 'Development' : 'Production');
console.log('🌐 Hostname:', window.location.hostname);
console.log('🌐 API URL:', API_URL);

// Global variables
let allStudents = [];
let studentToDelete = null;
let studentToEditPost = null;
let selectedStudents = new Set(); // Track selected students for bulk action

// Load students when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadStudents();
  // Auto-refresh every 30 seconds (reduced from 10 for better performance)
  setInterval(loadStudents, 30000);
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
    } else {
      showMessage(`❌ Error: ${data.error || 'Failed to load students'}`, 'error');
    }
  } catch (error) {
    console.error('Load students error:', error);
    showMessage(`❌ Failed to load students: ${error.message}`, 'error');
  }
}

// Animate number counting
function animateNumber(elementId, targetNumber) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
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
  
  if (!tbody) {
    console.error('Table body element not found');
    return;
  }
  
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;"><div style="color: #94a3b8; font-size: 16px;">📭 No students found</div></td></tr>';
    return;
  }

  tbody.innerHTML = students.map(student => `
    <tr>
      <td style="width: 40px;">
        <input type="checkbox" class="student-checkbox" value="${student.id}" onchange="updateSelectedStudents()">
      </td>
      <td>
        <img src="${escapeHtml(student.photo_url)}" alt="Photo" class="photo-thumb" onclick="viewPhoto('${student.id}', '${escapeHtml(student.photo_url)}')">
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
        <button class="button" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 8px 14px; font-size: 12px;" onclick="editPostModal('${student.id}', '${escapeHtml(student.full_name)}', '${escapeHtml(student.apply_for_post)}')">✏️ Edit</button>
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
  const searchInput = document.getElementById('searchInput');
  const postFilter = document.getElementById('postFilter');
  const statusFilter = document.getElementById('statusFilter');
  const batchFilter = document.getElementById('batchFilter');
  
  if (!searchInput || !postFilter || !statusFilter || !batchFilter) {
    console.error('Filter elements not found');
    return;
  }
  
  const search = searchInput.value.toLowerCase();
  const post = postFilter.value;
  const status = statusFilter.value;
  const batch = batchFilter.value;

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

    if (response.ok && data.success) {
      showMessage(`✅ ${studentName} has been selected! Confirmation email sent.`, 'success');
      await loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error || 'Selection failed'}`, 'error');
    }
  } catch (error) {
    console.error('Select student error:', error);
    showMessage(`❌ Failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Show delete confirmation modal
function deleteStudent(studentId) {
  studentToDelete = studentId;
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.add('show');
  }
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

    if (response.ok && data.success) {
      showMessage('✅ Student deleted successfully', 'success');
      closeDeleteModal();
      await loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error || 'Delete failed'}`, 'error');
    }
  } catch (error) {
    console.error('Delete student error:', error);
    showMessage(`❌ Delete failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Close delete modal
function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.remove('show');
  }
  studentToDelete = null;
}

// View photo with details
function viewPhoto(id, photoUrl) {
  const student = allStudents.find(s => s.id === id);
  
  if (!student) {
    console.error('Student not found');
    return;
  }
  
  // Set photo
  const modalPhoto = document.getElementById('modalPhoto');
  if (modalPhoto) {
    modalPhoto.src = photoUrl;
  }
  
  // Set details
  setElementText('detailFullName', student.full_name || '-');
  setElementText('detailID', student.ID_no || '-');
  setElementText('detailBatch', student.batch ? `Batch ${student.batch}` : 'N/A');
  setElementText('detailEmail', student.email || '-');
  setElementText('detailPhone', student.phone || '-');
  setElementText('detailDept', student.department || '-');
  setElementText('detailGender', student.gender || 'Not specified');
  setElementText('detailPost', student.apply_for_post || '-');
  
  const statusElement = document.getElementById('detailStatus');
  if (statusElement) {
    statusElement.innerHTML = `<span class="badge ${student.selected ? 'selected' : 'pending'}">${student.selected ? '✓ Selected' : '⏳ Pending'}</span>`;
  }
  
  setElementText('detailNote', student.note || 'No note available');
  
  resetZoom();
  const modal = document.getElementById('photoModal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Helper function to safely set element text
function setElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = escapeHtml(text);
  }
}

// Close photo modal
function closeModal() {
  const modal = document.getElementById('photoModal');
  if (modal) {
    modal.classList.remove('show');
  }
  resetZoom();
}

// Show edit post modal
function editPostModal(studentId, studentName, currentPost) {
  studentToEditPost = { id: studentId, currentPost };
  
  const nameElement = document.getElementById('editStudentName');
  if (nameElement) {
    nameElement.textContent = `Student: ${studentName} (Current Position: ${currentPost})`;
  }
  
  const postSelect = document.getElementById('newPost');
  if (postSelect) {
    postSelect.value = '';
  }
  
  const modal = document.getElementById('editPostModal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Close edit post modal
function closeEditPostModal() {
  const modal = document.getElementById('editPostModal');
  if (modal) {
    modal.classList.remove('show');
  }
  studentToEditPost = null;
}

// Confirm and update post
async function confirmEditPost() {
  if (!studentToEditPost) return;

  const postSelect = document.getElementById('newPost');
  if (!postSelect) return;
  
  const newPost = postSelect.value;
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

    if (response.ok && data.success) {
      showMessage(`✅ Position updated to ${newPost}! Email notification sent.`, 'success');
      closeEditPostModal();
      await loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error || 'Update failed'}`, 'error');
    }
  } catch (error) {
    console.error('Update post error:', error);
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
  if (!container) return;
  
  const className = type === 'error' ? 'error-message' : 'success-message';
  container.innerHTML = `<div class="${className}">${message}</div>`;
  
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Show loader overlay
function showLoader(message = 'Processing...') {
  // Remove existing loader if any
  hideLoader();
  
  const loaderDiv = document.createElement('div');
  loaderDiv.id = 'loaderOverlay';
  loaderDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 9999;';
  loaderDiv.innerHTML = `<div class="loader-container"><div class="spinner"></div><p>${escapeHtml(message)}</p></div>`;
  document.body.appendChild(loaderDiv);
}

// Hide loader overlay
function hideLoader() {
  const overlay = document.getElementById('loaderOverlay');
  if (overlay) {
    overlay.remove();
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  
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
  const zoomLevel = document.getElementById('zoomLevel');
  
  if (!img || !container || !zoomLevel) return;
  
  img.style.transform = `scale(${currentZoom / 100})`;
  img.style.transformOrigin = 'center top';
  img.style.transition = 'transform 0.2s ease';
  
  zoomLevel.textContent = currentZoom + '%';
  
  if (currentZoom > 100) {
    container.style.maxHeight = (currentZoom / 100) * 400 + 'px';
    container.style.overflow = 'auto';
  } else {
    container.style.maxHeight = 'auto';
    container.style.overflow = 'visible';
  }
}

// Toggle select all checkbox
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const checkboxes = document.querySelectorAll('.student-checkbox');
  
  if (!selectAllCheckbox) return;
  
  if (selectAllCheckbox.checked) {
    checkboxes.forEach(cb => {
      cb.checked = true;
      selectedStudents.add(cb.value);
    });
  } else {
    checkboxes.forEach(cb => {
      cb.checked = false;
      selectedStudents.delete(cb.value);
    });
  }
  
  updateSelectedStudents();
}

// Update selected students count and show/hide bulk actions
function updateSelectedStudents() {
  const checkboxes = document.querySelectorAll('.student-checkbox');
  selectedStudents.clear();
  
  checkboxes.forEach(cb => {
    if (cb.checked) {
      selectedStudents.add(cb.value);
    }
  });
  
  const bulkActions = document.getElementById('bulkActions');
  const selectedCountDisplay = document.getElementById('bulkSelectedCount');
  
  if (!bulkActions || !selectedCountDisplay) return;
  
  if (selectedStudents.size > 0) {
    bulkActions.style.display = 'flex';
    selectedCountDisplay.textContent = `${selectedStudents.size} selected`;
  } else {
    bulkActions.style.display = 'none';
    selectedCountDisplay.textContent = '0 selected';
  }
  
  // Update select all checkbox state
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
  }
}

// Bulk select all selected students
async function bulkSelectStudents() {
  if (selectedStudents.size === 0) {
    alert('Please select students to confirm');
    return;
  }
  
  if (!confirm(`Are you sure you want to confirm ${selectedStudents.size} student(s)? They will all receive confirmation emails.`)) {
    return;
  }
  
  showLoader(`Processing ${selectedStudents.size} students...`);
  
  try {
    const studentIds = Array.from(selectedStudents);
    
    // Send bulk selection request
    const response = await fetch(`${API_URL}/api/select/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ studentIds })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      showMessage(`✅ Successfully confirmed ${selectedStudents.size} student(s)! Emails sent.`, 'success');
      clearSelectedStudents();
      await loadStudents();
    } else {
      showMessage(`❌ Error: ${data.error || 'Bulk selection failed'}`, 'error');
    }
  } catch (error) {
    console.error('Bulk select error:', error);
    showMessage(`❌ Failed: ${error.message}`, 'error');
  } finally {
    hideLoader();
  }
}

// Clear all selections
function clearSelectedStudents() {
  selectedStudents.clear();
  
  const checkboxes = document.querySelectorAll('.student-checkbox');
  checkboxes.forEach(cb => cb.checked = false);
  
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = false;
  }
  
  updateSelectedStudents();
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    const photoModal = document.getElementById('photoModal');
    const deleteModal = document.getElementById('deleteModal');
    const editPostModal = document.getElementById('editPostModal');
    
    if (photoModal && photoModal.classList.contains('show')) {
      closeModal();
    }
    if (deleteModal && deleteModal.classList.contains('show')) {
      closeDeleteModal();
    }
    if (editPostModal && editPostModal.classList.contains('show')) {
      closeEditPostModal();
    }
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  const photoModal = document.getElementById('photoModal');
  const deleteModal = document.getElementById('deleteModal');
  const editPostModal = document.getElementById('editPostModal');
  
  // ESC key to close modals
  if (e.key === 'Escape') {
    if (photoModal && photoModal.classList.contains('show')) {
      closeModal();
    }
    if (deleteModal && deleteModal.classList.contains('show')) {
      closeDeleteModal();
    }
    if (editPostModal && editPostModal.classList.contains('show')) {
      closeEditPostModal();
    }
  }
  
  // Zoom controls when photo modal is open
  if (photoModal && photoModal.classList.contains('show')) {
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
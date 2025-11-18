# 🔴 404 ROUTE NOT FOUND - COMPLETE TROUBLESHOOTING GUIDE

## ❌ THE ERROR

```
GET http://localhost:5000/api/students 404 (Not Found)
```

or

```
POST http://localhost:5000/api/register 404 (Not Found)
```

---

## 📊 HOW 404 ERRORS HAPPEN

### Flow Diagram:

```
┌─────────────────────────────────────────────────────────┐
│ 1. FRONTEND (Browser)                                   │
│    fetch('http://localhost:5000/api/register')          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. BACKEND (Express Server)                             │
│    Receives: POST /api/register                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │  Route Handler Exists?   │
        └──────┬───────────────────┘
               │
        ┌──────┴──────────┐
        │                 │
       YES                NO
        │                 │
        ▼                 ▼
   ┌────────┐         ┌──────────┐
   │ 200 OK │         │ 404 ❌   │
   └────────┘         └──────────┘
   Process data       Route not found!
```

---

## 🔍 WHAT CAUSES 404 ERRORS

### Problem 1: Route Not Defined in Backend

**Backend code (MISSING):**
```javascript
// server.js - This route is MISSING!
// app.post('/api/register', ...) ← NOT HERE!

app.listen(5000);
```

**Frontend calls:**
```javascript
fetch('http://localhost:5000/api/register', { method: 'POST' })
```

**Result:**
```
❌ 404 - Cannot POST /api/register
```

### Problem 2: Wrong Route Path

**Backend code:**
```javascript
app.post('/register', ...) // Path is '/register'
```

**Frontend calls:**
```javascript
fetch('http://localhost:5000/api/register') // Calling '/api/register'
```

**Result:**
```
❌ 404 - Cannot POST /api/register
✅ Would work with: /register
```

### Problem 3: Wrong HTTP Method

**Backend code:**
```javascript
app.get('/api/register', ...) // GET method
```

**Frontend calls:**
```javascript
fetch('http://localhost:5000/api/register', { method: 'POST' }) // POST method
```

**Result:**
```
❌ 404 - Cannot POST /api/register
✅ Would work with: GET method
```

### Problem 4: Backend Not Running

**Frontend calls:**
```javascript
fetch('http://localhost:5000/api/register')
```

**But server crashed or not started:**
```
❌ ERR_CONNECTION_REFUSED
Cannot connect to localhost:5000
```

### Problem 5: Wrong Port

**Backend running on:**
```
http://localhost:5000
```

**Frontend calls:**
```
http://localhost:3000/api/register  // Wrong port!
```

**Result:**
```
❌ 404 - Wrong server
```

### Problem 6: API_URL Not Set

**Frontend (config.js):**
```javascript
const API_URL = undefined; // Oops!
```

**Frontend calls:**
```javascript
fetch(undefined + '/api/register') // undefined/api/register
```

**Result:**
```
❌ Invalid URL
```

---

## 🛠️ HOW TO FIX 404 ERRORS

### Fix 1: Add Missing Route to Backend

**In backend/server.js:**

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// ✅ ADD THIS ROUTE:
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, major } = req.body;
    
    // Validate
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }
    
    // Save to database (TODO)
    
    // Return success
    res.json({
      success: true,
      message: 'Registration successful',
      id: 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADD OTHER ROUTES:
app.get('/api/students', async (req, res) => {
  try {
    const students = []; // Get from DB
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Last: 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
```

### Fix 2: Verify API_URL in Frontend

**In frontend/config.js:**

```javascript
// ✅ CORRECT:
const API_URL = 'http://localhost:5000';

// ❌ WRONG:
const API_URL = 'http://localhost:3000';
const API_URL = undefined;
const API_URL = '';
```

### Fix 3: Make Sure Backend is Running

**Terminal 1:**
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/backend
npm run dev
```

**Expected output:**
```
✅ Server running on http://localhost:5000
```

**If you see:**
```
Error: Cannot find module 'express'
```

**Fix it:**
```bash
npm install
npm run dev
```

### Fix 4: Verify Frontend is Using Correct URL

**In frontend/script.js:**

```javascript
// ✅ CORRECT:
async function registerStudent(formData) {
  const response = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
}

// ❌ WRONG:
async function registerStudent(formData) {
  const response = await fetch('http://localhost:3000/api/register', {
    // Hard-coded wrong URL!
    method: 'POST',
    body: JSON.stringify(formData)
  });
}
```

### Fix 5: Check Route Path Spelling

**Backend has:**
```javascript
app.post('/api/register', ...)
```

**Frontend must call:**
```javascript
fetch(`${API_URL}/api/register`)  // ✅ EXACT MATCH

// NOT:
fetch(`${API_URL}/api/Register`)  // ❌ Capital R
fetch(`${API_URL}/api/registe`)   // ❌ Typo
fetch(`${API_URL}/register`)      // ❌ Missing /api/
```

---

## 🔬 HOW TO DEBUG 404 ERRORS

### Debug Step 1: Check Backend Routes

**In backend/server.js, look for:**

```javascript
// Should have these:
app.post('/api/register', ...)  ✓
app.get('/api/students', ...)   ✓
app.post('/api/login', ...)     ✓
app.delete('/api/students/:id', ...) ✓
```

### Debug Step 2: Check Network Tab

1. Open browser: `http://localhost:3000`
2. Press `F12` (DevTools)
3. Go to **Network** tab
4. Try to register
5. Look for red failed requests

**Example:**
```
POST /api/register  ❌ 404
```

Click it to see:

```
URL: http://localhost:5000/api/register
Method: POST
Status: 404 Not Found
Response: Cannot POST /api/register
```

### Debug Step 3: Test with curl

```bash
# Test backend is running
curl http://localhost:5000/health

# If you get JSON back - ✅ Backend running
# If you get error - ❌ Backend not running

# Test specific route
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# If 404 - route doesn't exist
# If 200/500 - route exists
```

### Debug Step 4: Check Console Logs

**Press F12 in browser:**

```javascript
// Console shows:
POST http://localhost:5000/api/register 404 (Not Found)

// And in backend terminal, you might see:
GET /api/register 404  // Wrong method or not defined
```

### Debug Step 5: Verify Server is Listening

**In terminal where backend runs:**

```
✅ Server running on http://localhost:5000  ← If you see this, server is good
```

**If you see:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:**
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Then restart
npm run dev
```

---

## 📋 ROUTE CHECKLIST

### These Routes MUST Exist

Create a checklist in `backend/server.js`:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ✅ Register student
app.post('/api/register', async (req, res) => {
  try {
    // TODO: Implement registration
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get all students
app.get('/api/students', async (req, res) => {
  try {
    // TODO: Get students from DB
    res.json({ students: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get student by ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // TODO: Get student from DB
    res.json({ student: null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // TODO: Delete from DB
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Admin login
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    // TODO: Validate password
    res.json({ token: 'jwt_token' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Send email
app.post('/api/send-email', async (req, res) => {
  try {
    const { email, subject, body } = req.body;
    // TODO: Send email
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ❌ 404 Handler (MUST BE LAST)
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
  console.log('✅ Routes available:');
  console.log('   GET  /health');
  console.log('   POST /api/register');
  console.log('   GET  /api/students');
  console.log('   POST /api/login');
  console.log('   etc.');
});
```

---

## ✅ VERIFICATION STEPS

Run through this checklist:

```
[ ] Backend running? (check terminal shows port 5000)
[ ] No npm errors? (check terminal for "error" messages)
[ ] API_URL correct? (frontend/config.js has http://localhost:5000)
[ ] Routes defined? (backend/server.js has app.post/get)
[ ] Paths match? (frontend calls /api/register, backend has /api/register)
[ ] Methods match? (POST→POST, GET→GET)
[ ] No typos? (register vs Register, /api vs api)
[ ] 404 handler is last? (after all other routes)
[ ] Console shows no errors? (F12 → Console tab)
[ ] Network shows 200? (F12 → Network tab → check requests)
```

---

## 🎯 QUICK FIX SUMMARY

| Error | Cause | Fix |
|-------|-------|-----|
| 404 /api/register | Route missing | Add `app.post('/api/register', ...)` |
| 404 all routes | Wrong API_URL | Check `config.js` has correct URL |
| Cannot connect | Server down | Run `npm run dev` in backend |
| 404 /register | Wrong path | Should be `/api/register` |
| ERR_CONNECTION_REFUSED | Port 5000 busy | `lsof -i :5000` then kill process |

---

## 🎓 EXAMPLE: COMPLETE WORKING SETUP

### backend/server.js
```javascript
const express = require('express');
const app = express();
app.use(express.json());

// ✅ Working routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.post('/api/register', (req, res) => res.json({ success: true }));
app.get('/api/students', (req, res) => res.json({ students: [] }));

// ✅ 404 last
app.use((req, res) => res.status(404).json({ error: 'not found' }));

app.listen(5000, () => console.log('✅ Server on :5000'));
```

### frontend/config.js
```javascript
const API_URL = 'http://localhost:5000'; // ✅ Correct
```

### frontend/script.js
```javascript
async function submit(data) {
  const res = await fetch(`${API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
```

**Result:** ✅ 200 OK - Works!

---

## 🎉 YOU'RE READY!

Follow the steps above to fix your 404 errors:

1. Add routes to backend
2. Verify API_URL in frontend
3. Make sure backend is running
4. Test with curl or browser
5. Check Network tab in DevTools
6. Debug with console logs

**Now go fix that 404!** 🚀


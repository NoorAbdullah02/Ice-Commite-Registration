# 🔍 Diagnosing "Route not found" Error

## What This Error Means

```
Error: Route not found
Response: {error: 'Route not found'}
Status: 404
```

This error comes from the **404 handler** in `backend/server.js` line 61:
```javascript
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

**This means**: The request is reaching the server, but NO route is matching it.

---

## Why This Happens

### Possible Causes:

1. **Backend not restarted** ❌
   - You made code changes
   - But old code is still running
   - Solution: Stop and restart backend

2. **Route not registered** ❌
   - registerRoute not properly mounted
   - registerRoute not properly exported
   - Solution: Check server.js mounting

3. **Wrong endpoint called** ❌
   - Frontend calling wrong URL
   - Solution: Check frontend fetch URL

4. **Route path mismatch** ❌
   - Backend has `/register`
   - But mounted at different path
   - Solution: Verify routing logic

---

## Current Configuration (CORRECT)

### Backend Routes (register.js)
```javascript
// Line 27
router.post('/register', async (req, res) => {
  // ✅ This creates a POST handler for /register
}

export default router;
// ✅ Router properly exported
```

### Server Mounting (server.js)
```javascript
// Line 41
app.use('/api', registerRoute);
// ✅ Mounts registerRoute at /api
// ✅ Final endpoint: /api + /register = /api/register
```

### Frontend Call (script.js)
```javascript
// Line 245
const response = await fetch(`${API_URL}/api/register`, {
// ✅ Calls correct endpoint
```

**MATH: /api + /register = /api/register ✅**

---

## How to Fix "Route not found"

### Step 1: Check Backend is Running
```bash
# In backend terminal, you should see:
🚀 Server running on http://localhost:5000
📝 Register: http://localhost:5000/
```

**If NOT showing**, your backend isn't running!

### Step 2: RESTART Backend
```bash
# Terminal 1 - STOP current backend (Ctrl+C)
# Then RESTART:
cd backend
npm run dev

# Wait for:
🚀 Server running on http://localhost:5000
```

**Restart is CRITICAL after code changes!**

### Step 3: Verify Route Works
```bash
# In a NEW terminal, test endpoint:
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test",
    "ID_no": "123",
    "phone": "1234567890",
    "email": "test@test.com",
    "department": "ICE",
    "gender": "Male",
    "apply_for_post": "President",
    "photo_url": "https://example.com/test.jpg"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Registration successful! Check your email.",
  "student": {...}
}
```

**If you get 404**: Backend needs restart or route is broken

### Step 4: Check Frontend
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Check console for any errors
# Should show:
📸 Uploading photo to: http://localhost:5000/api/upload
Submitting registration data to: http://localhost:5000/api/register
```

---

## Troubleshooting Checklist

- [ ] **Backend running?**
  - Terminal shows: `🚀 Server running on http://localhost:5000`
  - NOT showing? Start it: `npm run dev`

- [ ] **Backend restarted AFTER changes?**
  - Made changes? Stopped and restarted?
  - NOT restarted? Do it now with Ctrl+C and `npm run dev`

- [ ] **Port 5000 available?**
  - Another process using port 5000?
  - Check: `lsof -i :5000` (Mac/Linux)
  - Or: `netstat -ano | findstr :5000` (Windows)

- [ ] **Routes file correct?**
  - `backend/routes/register.js` has `router.post('/register')`?
  - Check: Line 27 says `router.post('/register'`

- [ ] **Server mounting correct?**
  - `backend/server.js` line 41 says `app.use('/api', registerRoute)`?

- [ ] **Frontend calling correct URL?**
  - `frontend/script.js` line 245 calling `/api/register`?
  - Check: `fetch(`${API_URL}/api/register`

- [ ] **Browser cache cleared?**
  - Refresh: Ctrl+Shift+R
  - Close DevTools
  - Hard refresh

---

## The Fix Summary

| Component | Expected | Status |
|-----------|----------|--------|
| Backend running | Yes | ✅ or ❌? |
| Port 5000 listening | Yes | ✅ or ❌? |
| /api/register route exists | Yes | ✅ CONFIRMED |
| Frontend calls /api/register | Yes | ✅ CONFIRMED |
| Browser cache cleared | Yes | ✅ or ❌? |

---

## Quickest Fix (Try This!)

### If you're getting "Route not found":

```bash
# 1. Go to backend folder
cd backend

# 2. STOP current server (press Ctrl+C in terminal)
# Wait for it to stop

# 3. RESTART with:
npm run dev

# 4. Wait for this message:
# 🚀 Server running on http://localhost:5000

# 5. Go to browser
# 6. Hard refresh: Ctrl+Shift+R
# 7. Try form submission again
```

---

## Why Backend Restart is Important

When you change code in Node.js:
1. ❌ OLD code keeps running
2. ❌ NEW code NOT loaded
3. ❌ Routes NOT updated
4. ❌ You get 404

Solution:
1. ✅ Stop the server (Ctrl+C)
2. ✅ Restart the server (npm run dev)
3. ✅ NEW code loads
4. ✅ Routes update
5. ✅ It works!

---

## Expected Success

After restart and refresh:

```
Console should show:
✅ 📸 Uploading photo to: http://localhost:5000/api/upload
✅ ✅ Upload response status: 200
✅ Submitting registration data to: http://localhost:5000/api/register
✅ ✅ Response Status: 201
✅ 🎉 Registration successful!
```

NOT:
```
❌ Response Status: 404
❌ {error: 'Route not found'}
```

---

## Still Getting 404?

If after all this you STILL get 404:

1. **Check console output** of backend for errors
2. **Check this file** is actually `/api/register`: `backend/routes/register.js`
3. **Check server.js** actually has: `app.use('/api', registerRoute)`
4. **Check exports**: `export default router`
5. **Check imports**: `import registerRoute from './routes/register.js'`

---

**Status**: Route is correctly configured ✅  
**Next Action**: RESTART BACKEND and hard refresh browser  
**Expected Result**: 201 Created (not 404)

Generated: November 19, 2025

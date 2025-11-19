# ⚡ QUICK FIX: "Route not found" Error

## The Error
```
POST http://localhost:5000/api/register 404 (Not Found)
Response: {error: 'Route not found'}
```

---

## The Fix (30 seconds)

### Step 1️⃣ STOP Backend
In backend terminal:
```
Press: Ctrl + C
Wait: Until prompt appears
```

### Step 2️⃣ RESTART Backend
```bash
npm run dev
```

### Step 3️⃣ REFRESH Browser
```
Press: Ctrl + Shift + R
```

### Step 4️⃣ TRY AGAIN
- Fill form
- Click Submit
- Check console

✅ Should now show: `Response Status: 201`  
❌ If still 404, see "Troubleshooting" below

---

## Why This Works

Node.js keeps old code in memory. You must restart to load new code.

```
Code changes
    ↓
npm run dev (reload)
    ↓
/api/register route now exists
    ↓
✅ Works!
```

---

## Troubleshooting If Still Broken

### 1. Check Backend Running
Backend terminal should show:
```
🚀 Server running on http://localhost:5000
```

### 2. Check Frontend URL
Open: `frontend/script.js` line 245

Should be:
```javascript
fetch(`${API_URL}/api/register`, {
```

### 3. Check Backend Route
Open: `backend/routes/register.js` line 27

Should be:
```javascript
router.post('/register', async (req, res) => {
```

### 4. Check Server Mounting
Open: `backend/server.js` line 41

Should be:
```javascript
app.use('/api', registerRoute);
```

### 5. Test Endpoint Manually
```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","ID_no":"123","phone":"1234567890","email":"test@test.com","department":"ICE","gender":"Male","apply_for_post":"President","photo_url":"https://example.com/test.jpg"}'
```

Expected: 201 with `{success: true, ...}`  
Getting: 404? → Restart backend again

---

## ✅ Success Checklist

- [ ] Ctrl+C on backend (stopped)
- [ ] `npm run dev` in backend folder (restarted)
- [ ] Sees `🚀 Server running...` message
- [ ] Waited 5 seconds for startup
- [ ] Ctrl+Shift+R in browser (hard refresh)
- [ ] Form filled and submitted
- [ ] Console shows Response Status: 201 (not 404)

---

## That's It!

The issue is 99% of the time that the backend needs a restart.

**Did it work?** ✅ You're done!  
**Still not working?** See full guide: `ROUTE_NOT_FOUND_DIAGNOSTIC.md`

---

Generated: November 19, 2025

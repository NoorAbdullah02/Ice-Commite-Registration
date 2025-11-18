# ⚡ RUNNING THE PROJECT - COMPLETE GUIDE

## 🚨 Current Status
✅ Dependencies installed  
✅ Prisma client generated  
⚠️ Database connection needs verification  

---

## 🔴 IF DATABASE CONNECTION FAILS

### 1. Check Neon Database Status
The provided Neon database might be inactive. **You have 2 options:**

#### Option A: Use Provided Neon DB (Recommended)
1. Go to: https://console.neon.tech
2. Log in with your credentials
3. Find project: "neondb"
4. Check if database is **ACTIVE** (green status)
5. If inactive, click to activate it
6. Copy fresh connection string from "Connection Details"
7. Update `.env` with new DATABASE_URL

#### Option B: Create Fresh Neon Database
1. Go to: https://console.neon.tech
2. Create new project
3. Copy connection string
4. Update `.env`:
```bash
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require&channel_binding=require"
```

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Verify Database Connection
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK

# Test connection
psql "$DATABASE_URL" -c "SELECT 1"
```

**Expected output:**
```
 ?column? 
----------
        1
(1 row)
```

**If connection fails:**
- Check `.env` DATABASE_URL
- Ensure Neon database is ACTIVE
- Verify IP whitelist (in Neon console)

### Step 2: Run Database Migration
Once connection works:
```bash
npx prisma migrate dev --name init
```

**Expected output:**
```
✔ Successfully created migrations folder at prisma/migrations
✔ A new migration to create the database schema is being created...
✔ A migration has been created with your new schema changes
✔ Run these migration scripts against your database to update your schema...
✔ Successfully ran 2 migrations and synced Prisma schema with database
```

### Step 3: Seed Default Admins
```bash
npm run seed
```

**Expected output:**
```
🌱 Seeding database...
✅ Admin created: ice_dep
✅ Admin created: noor
✨ Seeding complete!
```

### Step 4: Verify Database
```bash
# Open Prisma Studio
npx prisma studio
```

This opens http://localhost:5555 where you can see:
- ✅ Admin table with 2 users
- ✅ Student table (empty initially)

---

## 🚀 RUNNING THE SERVER

### Option 1: Development Mode (Auto-reload)
```bash
npm run dev
```

**Output:**
```
🚀 Server running on http://localhost:5000
📝 Register: http://localhost:5000/
🔐 Admin: http://localhost:5000/login.html
```

### Option 2: Production Mode
```bash
npm start
```

---

## 🌐 ACCESSING THE APPLICATION

Open your browser:

| Page | URL |
|------|-----|
| **Home** | http://localhost:5000 |
| **Student Register** | http://localhost:5000/ |
| **Admin Login** | http://localhost:5000/login.html |
| **Admin Dashboard** | http://localhost:5000/admin.html |

---

## 🔐 Admin Login Credentials

```
Username: ice_dep
Password: ice_dep12

OR

Username: noor
Password: noorabdullah
```

---

## 🧪 QUICK TEST WORKFLOW

### Test 1: Register a Student (2 minutes)
1. Open http://localhost:5000/
2. Fill form:
   ```
   Full Name: John Doe
   ID: 12345
   Phone: 01234567890
   Email: john@example.com
   Department: CSE
   Gender: Male
   Post: President
   ```
3. Upload a photo (JPG/PNG, < 3MB)
4. Click "Submit Registration"
5. Should see ✅ success message
6. Redirect to http://localhost:5000/success.html

### Test 2: Check Email
- Check your email inbox (check @example.com forwarding)
- Should see: "Form Received - ICE Committee"

### Test 3: Admin Login (1 minute)
1. Open http://localhost:5000/login.html
2. Enter: `ice_dep` / `ice_dep12`
3. Click "Login"
4. Should redirect to http://localhost:5000/admin.html

### Test 4: Admin Dashboard (1 minute)
1. See statistics:
   - Total Candidates: 1
   - Selected: 0
   - Pending: 1
2. Search for student by name
3. Click photo thumbnail to see profile modal
4. Click "Select" button
5. Should see ✅ "Student selected! Email sent."
6. Check email for selection notification

### Test 5: Admin Delete (30 seconds)
1. Click "Delete" on any student
2. Confirm deletion
3. Student removed from list

---

## 🔧 TROUBLESHOOTING

### Problem: "Can't reach database server"
```
Error: P1001: Can't reach database server
```

**Solutions:**
```bash
# 1. Check DATABASE_URL
cat .env | grep DATABASE_URL

# 2. Test connection
psql "$DATABASE_URL" -c "SELECT 1"

# 3. If fails, go to Neon and:
#    - Activate database
#    - Update connection string in .env
#    - Run migration again
```

### Problem: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill existing process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Problem: "Prisma error"
```bash
# Reset and start fresh
rm -rf node_modules .next
npm install
npx prisma generate
npx prisma migrate reset
npm run seed
npm run dev
```

### Problem: "Photo upload fails"
- ✅ Check file size < 3MB
- ✅ Check file type is JPG/PNG
- ✅ Verify Cloudinary credentials in `.env`
- ✅ Test in browser DevTools Network tab (F12)

### Problem: "Email not sending"
- ✅ Check BREVO_API_KEY in `.env`
- ✅ Check BREVO_FROM_EMAIL is correct
- ✅ Check email spam folder
- ✅ Verify email recipient is valid

### Problem: "Can't login to admin"
- ✅ Run `npm run seed` to create default users
- ✅ Check credentials: ice_dep / ice_dep12
- ✅ Verify JWT_SECRET in `.env`
- ✅ Check browser cookies (F12 → Application → Cookies)

---

## 🔄 FULL FRESH START (If something breaks)

```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK

# 1. Clean everything
rm -rf node_modules package-lock.json
rm -rf prisma/migrations
rm -rf .prisma

# 2. Fresh install
npm install
npm install multer

# 3. Generate client
npx prisma generate

# 4. Migrate database
npx prisma migrate dev --name init

# 5. Seed data
npm run seed

# 6. Run
npm run dev
```

---

## 📊 DATABASE MANAGEMENT

### View Data in UI
```bash
npx prisma studio
```
Opens: http://localhost:5555

### Check Neon Console
1. Go to: https://console.neon.tech
2. Select your project
3. Go to "SQL Editor"
4. Run query to check tables:
```sql
SELECT * FROM "Student";
SELECT * FROM "Admin";
```

### Backup Database
```bash
pg_dump "$DATABASE_URL" > backup.sql
```

---

## 🎯 NEXT STEPS AFTER RUNNING

1. **Test Everything**
   - [ ] Register a student
   - [ ] Receive confirmation email
   - [ ] Admin login
   - [ ] View dashboard
   - [ ] Select a student
   - [ ] Receive selection email

2. **Customize** (Optional)
   - Update form fields in `frontend/index.html`
   - Modify email templates in `backend/utils/email.js`
   - Change colors in `frontend/style.css`

3. **Deploy** (When ready)
   - See DEPLOY_GUIDE.md for Railway/Render/Vercel

---

## 🆘 STILL HAVING ISSUES?

### Check These Files
```bash
# Verify .env exists and is complete
cat .env

# Check if server starts
npm run dev

# Check database connection
npx prisma db execute --stdin

# View logs
cat server.log

# Check Prisma status
npx prisma --version
```

### Get Detailed Logs
```bash
npm run dev 2>&1 | tee debug.log
```

Then share the `debug.log` for help.

---

## 🎉 SUCCESS CHECKLIST

Before declaring victory, verify:

- [ ] ✅ `npm run dev` starts without errors
- [ ] ✅ Can access http://localhost:5000
- [ ] ✅ Registration form loads
- [ ] ✅ Can upload photo
- [ ] ✅ Registration submits successfully
- [ ] ✅ Confirmation email received
- [ ] ✅ Can login to admin (ice_dep/ice_dep12)
- [ ] ✅ Admin dashboard shows statistics
- [ ] ✅ Can select a student
- [ ] ✅ Selection email received
- [ ] ✅ Can delete a student
- [ ] ✅ Mobile responsive works

---

## 📞 QUICK COMMAND REFERENCE

```bash
# Install & Setup
npm install
npm install multer
npx prisma generate

# Database
npx prisma migrate dev --name init
npx prisma studio
npx prisma migrate reset

# Seed
npm run seed

# Run
npm run dev
npm start

# Debug
npx prisma --version
npm list
cat .env
```

---

**You're all set! Let's go! 🚀**

Follow these steps exactly, and your app will be running in < 10 minutes!

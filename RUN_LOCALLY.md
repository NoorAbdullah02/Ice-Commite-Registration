# 🚀 RUN YOUR PROJECT LOCALLY

Complete guide to run both backend and frontend on your machine.

---

## 📋 PREREQUISITES

Make sure you have installed:

```bash
# Check Node.js version (need 14+)
node --version

# Check npm version (need 6+)
npm --version

# Check git
git --version
```

If not installed, download from: https://nodejs.org/ (LTS version)

---

## 🎯 QUICK START (2 minutes)

### Option 1: Run Everything with One Command

```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK
npm run setup
```

This will:
1. ✅ Install backend dependencies
2. ✅ Generate Prisma Client
3. ✅ Install frontend dependencies
4. ✅ Everything ready!

### Option 2: Run Backend & Frontend Separately

**Terminal 1 - Backend:**
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/frontend
npm install
npm start
```

---

## 🔧 DETAILED SETUP

### Step 1: Clone Repository (If You Don't Have It)

```bash
git clone https://github.com/NoorAbdullah02/Ice-Commite-Registration.git
cd Ice-Commite-Registration
```

### Step 2: Set Up Backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with test data
npm run prisma:seed
```

### Step 3: Set Up Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ice_committee"

# Email Service (Brevo)
BREVO_API_KEY="your_brevo_api_key"
BREVO_SENDER_EMAIL="your-email@example.com"

# Photo Upload (Cloudinary)
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_KEY="your_cloudinary_key"
CLOUDINARY_SECRET="your_cloudinary_secret"

# Authentication
JWT_SECRET="your_jwt_secret_key"
ADMIN_PASSWORD="your_admin_password"

# Server
PORT=5000
NODE_ENV=development
```

### Step 4: Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env`:

```env
API_URL="http://localhost:5000"
```

Or edit `frontend/config.js`:

```javascript
const API_URL = 'http://localhost:5000';
```

---

## ▶️ RUNNING THE PROJECT

### Option A: Run Backend & Frontend Together

**Terminal 1 - Start Backend:**
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/backend
npm run dev
```

Output should show:
```
✅ Server running on http://localhost:5000
✅ Connected to database
```

**Terminal 2 - Start Frontend:**
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/frontend
npm start
```

Output should show:
```
✔ Accepting connections at http://localhost:3000
```

**Open in Browser:**
```
http://localhost:3000
```

### Option B: Run Just Backend

```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/backend
npm run dev
```

Test with curl:
```bash
curl http://localhost:5000/health
```

### Option C: Run Just Frontend (Static Server)

```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/frontend
npm install -g http-server
http-server -p 3000
```

Visit: `http://localhost:3000`

---

## 📂 PROJECT STRUCTURE

```
ICPC_MOCK/
├── backend/
│   ├── server.js              ← Express app
│   ├── package.json           ← Dependencies
│   ├── .env                   ← Configuration
│   ├── prisma/
│   │   ├── schema.prisma      ← Database schema
│   │   └── migrations/        ← Database changes
│   └── routes/
│       └── api.js             ← API endpoints
│
├── frontend/
│   ├── index.html             ← Registration form
│   ├── admin.html             ← Admin dashboard
│   ├── login.html             ← Login page
│   ├── success.html           ← Success page
│   ├── config.js              ← API configuration
│   ├── script.js              ← Form logic
│   ├── admin.js               ← Admin logic
│   ├── style.css              ← Styles
│   └── package.json           ← Dependencies
│
├── build.sh                   ← Render build script
├── render.yaml                ← Render config
└── README.md                  ← Documentation
```

---

## 🗄️ DATABASE SETUP

### Option 1: Use PostgreSQL Locally

**Install PostgreSQL:**
```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

**Start PostgreSQL:**
```bash
# macOS
brew services start postgresql

# Ubuntu/Debian
sudo service postgresql start

# Windows
# Starts automatically
```

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE ice_committee;
\q
```

**Update `.env`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ice_committee"
```

### Option 2: Use Neon (Free Cloud Database)

1. Go to https://neon.tech
2. Sign up (free)
3. Create a project
4. Copy connection string
5. Paste in `backend/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@neon.tech/database"
   ```

### Option 3: Use Railway (Free Cloud Database)

1. Go to https://railway.app
2. Sign up (free)
3. Create PostgreSQL database
4. Copy connection string
5. Paste in `backend/.env`

---

## ✅ VERIFY SETUP

### Check Backend

```bash
cd backend

# Check if server starts
npm run dev

# Output should show:
# ✅ Server running on http://localhost:5000
# ✅ Database connected
# ✅ Express app listening
```

### Check Frontend

```bash
cd frontend

# Check if server starts
npm start

# Output should show:
# ✔ Accepting connections at http://localhost:3000
```

### Test API Endpoints

```bash
# In another terminal
curl http://localhost:5000/health
# Should return: {"status":"ok"}

curl http://localhost:5000/api/students
# Should return: {"students":[]}
```

---

## 🧪 TEST THE APPLICATION

### 1. Test Registration Form

1. Open: `http://localhost:3000`
2. Fill form:
   - Name: Test Student
   - Email: test@example.com
   - Phone: 1234567890
   - Major: Computer Science
   - Photo: Select any image
3. Click Submit
4. Should see success page

### 2. Test Admin Dashboard

1. Open: `http://localhost:3000/admin.html`
2. Login with credentials from `.env` (ADMIN_PASSWORD)
3. Should see:
   - List of students
   - Filters (Name, Email)
   - Actions (Select, Delete, Email)
4. Try filtering and selecting students

### 3. Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Should see no errors
4. Try registering and watch Network tab

### 4. Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Register a student
4. Should see:
   - POST /api/register → 200 ✅
   - Response contains student data

---

## 🔧 COMMON ISSUES & FIXES

### Issue: "Cannot find module 'express'"

**Fix:**
```bash
cd backend
npm install
```

### Issue: "Could not find Prisma Schema"

**Fix:**
```bash
cd backend
npm run prisma:generate
```

### Issue: "EADDRINUSE: address already in use :::5000"

**Fix:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Issue: "EADDRINUSE: address already in use :::3000"

**Fix:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
npm start -- --port 3001
```

### Issue: "Database connection failed"

**Fix:**
1. Check DATABASE_URL in `.env`
2. Verify PostgreSQL is running:
   ```bash
   psql -U postgres
   ```
3. Test connection string:
   ```bash
   psql <DATABASE_URL>
   ```

### Issue: "ENOENT: no such file or directory"

**Fix:**
```bash
# Make sure you're in correct directory
pwd
# Should show: /home/noor-abdullah/Desktop/ICPC_MOCK

# Check files exist
ls -la backend/
ls -la frontend/
```

---

## 📊 DEVELOPMENT WORKFLOW

### Adding a New Feature

1. **Create branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes:**
   - Edit files
   - Test locally
   - Verify in browser

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add my feature"
   ```

4. **Push to GitHub:**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create Pull Request** on GitHub

### Running Tests

```bash
cd backend

# Run tests (if available)
npm test
```

### Building for Production

**Backend:**
```bash
npm run build
npm start
```

**Frontend:**
```bash
npm run build
```

---

## 🎯 USEFUL COMMANDS

### Backend Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed
```

### Frontend Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Install dependencies
npm install
```

### Project Root Commands

```bash
# Setup everything
npm run setup

# Start backend
npm run backend:dev

# Start frontend
npm run frontend:dev

# Start backend production
npm run backend:start
```

---

## 🌐 LOCAL URLS

After starting both servers:

| URL | Description |
|-----|-------------|
| `http://localhost:3000/` | Registration form |
| `http://localhost:3000/admin.html` | Admin dashboard |
| `http://localhost:3000/login.html` | Login page |
| `http://localhost:3000/success.html` | Success page |
| `http://localhost:5000/health` | API health check |
| `http://localhost:5000/api/register` | Register endpoint |
| `http://localhost:5000/api/students` | Get students endpoint |

---

## 📱 TEST ON MOBILE (Local Network)

### Get Your Computer's IP:

```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

Look for IP like `192.168.1.x`

### Access from Phone:

Open in browser:
```
http://192.168.1.x:3000
```

(Replace with your actual IP)

---

## 🐛 DEBUG MODE

### Enable Verbose Logging

**Backend:**
```bash
DEBUG=* npm run dev
```

**Frontend:**

Open DevTools (F12) and run:
```javascript
// Enable verbose logging
localStorage.debug = '*';
window.location.reload();
```

### Check Logs

```bash
# Backend logs
tail -f backend/server.js

# Database logs
psql -U postgres -d ice_committee -c "SELECT * FROM pg_stat_statements;"
```

---

## 📚 DOCUMENTATION LINKS

- **Node.js:** https://nodejs.org/docs
- **Express:** https://expressjs.com
- **Prisma:** https://www.prisma.io/docs
- **PostgreSQL:** https://www.postgresql.org/docs
- **Neon:** https://neon.tech/docs
- **Railway:** https://docs.railway.app

---

## ✅ QUICK CHECKLIST

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Repository cloned
- [ ] `.env` file created with variables
- [ ] Backend dependencies installed (`npm install`)
- [ ] Prisma generated (`npm run prisma:generate`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Database created and running
- [ ] Backend started (`npm run dev`)
- [ ] Frontend started (`npm start`)
- [ ] Browser opens to `http://localhost:3000`
- [ ] Registration form loads
- [ ] Can submit test registration
- [ ] Admin dashboard loads
- [ ] Can login and view students

---

## 🎉 YOU'RE READY!

```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm start

# Browser: 
# Open http://localhost:3000
```

That's it! Your project is running locally! 🚀


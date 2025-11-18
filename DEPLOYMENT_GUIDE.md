# 🚀 DEPLOYMENT GUIDE - SEPARATED BACKEND & FRONTEND

**Date:** November 19, 2025  
**Status:** ✅ Ready for Deployment  

---

## 📁 Project Structure

```
ice-committee-registration/
├── backend/                    (Node.js + Express + PostgreSQL)
│   ├── server.js              (Main server)
│   ├── package.json            (Dependencies)
│   ├── .env                    (Environment variables)
│   ├── prisma/                 (Database)
│   ├── routes/                 (API endpoints)
│   ├── middleware/             (Auth, validation)
│   └── utils/                  (Helpers)
│
├── frontend/                   (HTML + CSS + JavaScript)
│   ├── index.html              (Registration form)
│   ├── admin.html              (Admin dashboard)
│   ├── login.html              (Login page)
│   ├── success.html            (Success page)
│   ├── *.js                    (Scripts)
│   ├── *.css                   (Styles)
│   └── package.json            (Static server)
│
└── README.md
```

---

## 🎯 OPTION 1: DEPLOY TOGETHER ON RENDER (RECOMMENDED)

### ✅ Best for: Quick single-server deployment

### Step 1: Prepare for Deployment

```bash
# Clean up node_modules
cd backend
npm install
npm run prisma:generate

cd ../frontend
npm install
```

### Step 2: Update Frontend API URL

Edit `frontend/config.js`:

```javascript
// Before:
// const API_URL = 'http://localhost:5000';

// After:
const API_URL = 'https://your-backend.onrender.com';
```

Update all JavaScript files that reference the API:
- `frontend/script.js`
- `frontend/admin.js`
- `frontend/login.js`

### Step 3: Create Render Configuration

Create `render.yaml`:

```yaml
services:
  - type: web
    name: ice-committee-backend
    runtime: node
    region: singapore
    plan: free
    buildCommand: "cd backend && npm install && npx prisma generate"
    startCommand: "cd backend && node server.js"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: ice-committee-db
          property: connectionString
      - key: JWT_SECRET
        sync: false
      - key: PORT
        value: "5000"
    routes:
      - path: /api
        destination: http://localhost:5000
  
  - type: web
    name: ice-committee-frontend
    runtime: static
    staticPublishPath: frontend
    routes:
      - path: /
        destination: /index.html

databases:
  - name: ice-committee-db
    engine: postgres
    version: "15"
    plan: free
```

### Step 4: Deploy

```bash
# Login to Render
npx render-cli login

# Deploy
git push origin master
# Render auto-deploys from GitHub
```

---

## 🎯 OPTION 2: DEPLOY SEPARATELY (FLEXIBLE)

### ✅ Best for: Independent scaling, different hosting services

### 🔴 BACKEND DEPLOYMENT (Node.js)

#### On Render:

```bash
1. Create new Web Service on Render
2. Connect to GitHub repository
3. Build Command: npm install && npm run prisma:generate
4. Start Command: npm start
5. Add Environment Variables:
   - DATABASE_URL=postgresql://...
   - JWT_SECRET=your-secret
   - BREVO_API_KEY=your-key
   - CLOUDINARY_CLOUD_NAME=your-cloud
   - CLOUDINARY_API_KEY=your-key
   - CLOUDINARY_API_SECRET=your-secret
   - ADMIN_EMAIL=admin@example.com
```

#### On Railway:

```bash
1. Create new service
2. Connect GitHub
3. Environment variables same as above
4. Auto-deploy on push
```

#### On Heroku:

```bash
heroku create ice-committee-api
heroku config:set DATABASE_URL=postgresql://...
git push heroku master
```

### 🟦 FRONTEND DEPLOYMENT (Static)

#### Option A: Netlify (RECOMMENDED)

```bash
1. Connect GitHub to Netlify
2. Build Command: (leave empty - no build needed)
3. Publish Directory: frontend
4. Add Environment Variable:
   - API_URL=https://your-backend.onrender.com
```

#### Option B: Vercel

```bash
vercel --name=ice-committee-frontend
# Configure to serve frontend folder
```

#### Option C: GitHub Pages

```bash
1. Enable GitHub Pages in settings
2. Set source to /frontend folder
3. Update API_URL in frontend/config.js
```

---

## 🌍 DEPLOYING BACKEND

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Render/Railway account
- GitHub repository

### Deployment Steps

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Generate Prisma client
npm run prisma:generate

# 4. Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://user:password@host/db"
JWT_SECRET="your-secret-key"
PORT=5000
BREVO_API_KEY="your-brevo-key"
BREVO_FROM_EMAIL="noreply@example.com"
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
ADMIN_EMAIL="admin@example.com"
EOF

# 5. Test locally
npm run dev

# 6. Push to GitHub
git add .
git commit -m "Ready for backend deployment"
git push origin master

# 7. Deploy on Render
# - Create new Web Service
# - Connect GitHub repository
# - Set environment variables
# - Deploy!
```

---

## 🎨 DEPLOYING FRONTEND

### Prerequisites

- Netlify/Vercel/GitHub Pages account
- API endpoint URL from backend

### Deployment Steps

```bash
# 1. Navigate to frontend
cd frontend

# 2. Update config.js with backend URL
nano config.js
# Change: const API_URL = 'https://your-backend-url.com';

# 3. Test locally
npm install
npm start

# 4. Deploy to Netlify (Recommended)
npm install -g netlify-cli
netlify deploy --prod --dir=.

# OR push to GitHub for auto-deploy
git add .
git commit -m "Frontend ready for deployment"
git push origin master
```

---

## 🧪 VERIFICATION CHECKLIST

### Backend Deployment

- [ ] Server starts without errors
- [ ] Environment variables loaded
- [ ] Database connection successful
- [ ] Prisma migrations applied
- [ ] API endpoints respond to requests
- [ ] CORS enabled for frontend URL
- [ ] Email service working
- [ ] File upload working

### Frontend Deployment

- [ ] Website loads at deployed URL
- [ ] Registration form displays correctly
- [ ] API URL points to correct backend
- [ ] Forms submit successfully
- [ ] Admin dashboard accessible
- [ ] Photos upload and display
- [ ] Email notifications received
- [ ] Responsive on mobile

---

## 🔗 ENVIRONMENT VARIABLES NEEDED

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-very-secure-secret-key-minimum-32-chars

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=ICE Committee

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Admin
ADMIN_EMAIL=admin@yourdomain.com
```

### Frontend `config.js`

```javascript
// For production
const API_URL = 'https://your-backend-domain.com';
```

---

## 📊 DEPLOYMENT COMPARISON

| Feature | Render | Railway | Heroku |
|---------|--------|---------|--------|
| **Free Tier** | ✅ Yes | ✅ Yes | ❌ No |
| **Auto Deploy** | ✅ GitHub | ✅ GitHub | ✅ GitHub |
| **Database** | ✅ Included | ✅ Included | ✅ Add-on |
| **Speed** | ⚡ Fast | ⚡ Fast | ⚡ Medium |
| **Support** | ✅ Good | ✅ Good | ✅ Good |
| **Cost** | Free-$7 | Free-$5 | $7+ |
| **Recommended** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🚀 QUICK START - RENDER DEPLOYMENT

### For Backend:

```bash
1. Create GitHub account & push code
2. Create Render account (render.com)
3. New Web Service → Connect GitHub
4. Build: npm install && npm run prisma:generate
5. Start: npm start
6. Add DATABASE_URL environment variable
7. Deploy!
```

### For Frontend:

```bash
1. Create Netlify account (netlify.com)
2. Connect GitHub repository
3. Build: (empty)
4. Publish: frontend
5. Add environment variable: API_URL
6. Deploy!
```

**Total Time: 15-20 minutes** ⚡

---

## 🔒 SECURITY CHECKLIST

- [ ] `.env` file not committed to git
- [ ] Environment variables hidden in hosting service
- [ ] Database credentials secured
- [ ] JWT secret is strong (32+ characters)
- [ ] API keys not exposed in frontend code
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Password hashing enabled
- [ ] Rate limiting enabled

---

## 📞 TROUBLESHOOTING

### Backend won't start

```bash
# Check logs
npm run dev

# Errors to look for:
# - DATABASE_URL not set
# - Port already in use
# - Dependencies not installed
```

### Frontend can't reach backend

```javascript
// Check config.js
console.log('API URL:', API_URL);

// Ensure backend is running
// Ensure CORS is enabled in backend
// Check network tab in browser
```

### Database connection error

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Regenerate Prisma
npm run prisma:generate

# Check migrations
npm run prisma:migrate
```

---

## 📚 FINAL CHECKLIST

- [ ] Backend built and tested locally
- [ ] Frontend updated with correct API URL
- [ ] `.env` file created with all variables
- [ ] Prisma client generated
- [ ] Database migrations run
- [ ] Code pushed to GitHub
- [ ] Render/hosting service created
- [ ] Environment variables configured
- [ ] Deployment triggered
- [ ] Website tested in production
- [ ] Emails working
- [ ] Admin dashboard accessible
- [ ] Photos uploading correctly

---

## 🎉 YOU'RE READY TO DEPLOY!

Everything is separated, cleaned up, and ready for production deployment.

**Next Step:** Choose your deployment option and follow the steps above.

**Estimated Time:** 15-30 minutes to go live! 🚀

---

**Questions?** Check the troubleshooting section or consult the hosting provider's documentation.

**Good luck with your deployment!** 🌟

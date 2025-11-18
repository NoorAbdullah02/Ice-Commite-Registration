# ⚡ QUICK START - RUN LOCALLY IN 30 SECONDS

## 🚀 THE FASTEST WAY

### Terminal 1: Start Backend
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/backend
npm install
npm run dev
```

Expected output:
```
✅ Server running on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK/frontend
npm install
npm start
```

Expected output:
```
✔ Accepting connections at http://localhost:3000
```

### Open Browser
```
http://localhost:3000
```

---

## 🎯 WHAT YOU'LL SEE

✅ **Registration Form** - Fill and submit  
✅ **Success Page** - Shows after submission  
✅ **Admin Dashboard** - Access at `/admin.html`  
✅ **All features working** - Emails, photos, database

---

## 📋 CHECKLIST

- [ ] Have Node.js installed? (`node --version`)
- [ ] In /backend folder? (`pwd`)
- [ ] Created .env file with DATABASE_URL?
- [ ] Run `npm install`?
- [ ] Run `npm run dev` in backend?
- [ ] Run `npm install` in frontend?
- [ ] Run `npm start` in frontend?
- [ ] Opened http://localhost:3000 in browser?

---

## ❌ TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| "npm not found" | Install Node.js from nodejs.org |
| "Cannot find module" | Run `npm install` |
| "Port 5000 in use" | Change PORT in .env or kill process |
| "Database error" | Create .env with DATABASE_URL |
| "404 on localhost" | Check frontend `npm start` running |

---

## 🌐 IMPORTANT URLS

| Page | URL |
|------|-----|
| Registration | http://localhost:3000 |
| Admin | http://localhost:3000/admin.html |
| API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

---

## 📱 FILES YOU NEED

Create these files before starting:

### `backend/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ice_committee"
BREVO_API_KEY="your_key"
CLOUDINARY_NAME="your_name"
CLOUDINARY_KEY="your_key"
CLOUDINARY_SECRET="your_secret"
JWT_SECRET="secret_key"
ADMIN_PASSWORD="your_password"
PORT=5000
```

### `frontend/config.js` (or .env)
```javascript
const API_URL = 'http://localhost:5000';
```

---

## 🎉 YOU'RE DONE!

Start the 2 terminals, open the browser, and test!

Need detailed help? Read: `RUN_LOCALLY.md`

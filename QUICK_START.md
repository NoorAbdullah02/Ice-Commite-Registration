# 🚀 QUICK START GUIDE

## ⏱️ 5-Minute Setup

### 1. Install Dependencies
```bash
cd backend
npm install
npm run prisma:generate
```

### 2. Configure Environment
```bash
# Edit .env file in backend directory
# Add these variables:
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
BREVO_API_KEY="your-key"
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
```

### 3. Setup Database
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Access App
- **Registration:** http://localhost:5000/
- **Admin:** http://localhost:5000/admin.html

---

## 📝 Environment Variables

Copy from `.env.example` or create `.env` with:

```env
DATABASE_URL=postgresql://user:password@host:5432/db
PORT=5000
JWT_SECRET=your-very-secret-key-32-chars-minimum
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@example.com
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghij
ADMIN_EMAIL=admin@example.com
```

---

## 🧪 Test the System

### Register New Student
1. Go to http://localhost:5000/
2. Fill the form
3. Upload a photo
4. Click Register
5. Check your email for confirmation

### Access Admin Dashboard
1. Go to http://localhost:5000/admin.html
2. Login with credentials from seed
3. View registered students
4. Test filters and actions

---

## 🚀 Deploy to Production

**See `DEPLOYMENT_GUIDE.md` for complete deployment instructions**

### Quick Render Deployment:
```bash
1. Push to GitHub
2. Create Web Service on Render
3. Set DATABASE_URL environment variable
4. Deploy!
```

---

## 🆘 Troubleshooting

### Error: Could not find Prisma Schema
```bash
npm run prisma:generate
```

### Error: Database connection failed
```bash
# Check DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Port 5000 already in use
```bash
# Change PORT in .env or:
lsof -i :5000
kill -9 <PID>
```

### Email not working
- Verify BREVO_API_KEY is correct
- Check BREVO_FROM_EMAIL matches
- Monitor Brevo dashboard

---

## 📚 File Structure

```
backend/
├── server.js          # Main server file
├── routes/            # API endpoints
├── middleware/        # Authentication
├── utils/             # Helpers
├── prisma/            # Database
└── .env               # Configuration

frontend/
├── index.html         # Registration page
├── admin.html         # Admin dashboard
├── login.html         # Login page
├── *.js               # Page logic
└── *.css              # Styles
```

---

## 🎯 Features

✅ Student Registration  
✅ Photo Upload  
✅ Email Notifications  
✅ Admin Dashboard  
✅ Student Management  
✅ Batch Support  
✅ Advanced Search/Filters  
✅ Secure Authentication  
✅ Production Ready  

---

## 📞 Need Help?

1. Check `.env` configuration
2. Review error messages
3. Check browser console
4. Check server logs
5. See DEPLOYMENT_GUIDE.md for more

---

**Ready? Start with:** `npm run dev` 🚀

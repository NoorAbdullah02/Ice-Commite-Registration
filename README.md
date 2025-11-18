# 🎓 ICE Committee Registration Portal

**A professional registration system for ICE Committee with admin dashboard, batch management, and email notifications.**

Built with **Node.js + Express + PostgreSQL + Vanilla JavaScript**

---

## ✨ Features

✅ **Student Registration** - Beautiful form with validation  
✅ **Photo Upload** - Direct to Cloudinary (JPG/PNG, 3MB)  
✅ **Email Notifications** - Automatic confirmation via Brevo  
✅ **Admin Dashboard** - Complete student management  
✅ **JWT Authentication** - Secure with HttpOnly cookies  
✅ **Batch Management** - Support for multiple batches (14, 15, 16)  
✅ **Advanced Filtering** - Search by name, email, ID, batch, post, status  
✅ **Student Selection** - Mark as selected with confirmation email  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Production Ready** - Fully tested and documented  

---

## 📁 Project Structure

```
ice-committee-registration/
├── backend/
│   ├── server.js               # Express server
│   ├── package.json            # Dependencies
│   ├── .env                    # Environment variables
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.js             # Seed data
│   ├── routes/
│   │   ├── register.js         # Registration API
│   │   ├── adminLogin.js       # Admin authentication
│   │   ├── students.js         # Fetch students
│   │   ├── select.js           # Select/delete students
│   │   └── upload.js           # File upload
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   └── utils/
│       ├── jwt.js              # Token utilities
│       ├── cloudinary.js       # Image upload
│       └── email.js            # Email sender
│
├── frontend/
│   ├── index.html              # Registration form
│   ├── admin.html              # Admin dashboard
│   ├── login.html              # Admin login
│   ├── success.html            # Success page
│   ├── config.js               # API configuration
│   ├── script.js               # Form logic
│   ├── admin.js                # Dashboard logic
│   ├── login.js                # Login logic
│   ├── style.css               # Global styles
│   ├── style_admin.css         # Admin styles
│   └── package.json            # Static server
│
└── DEPLOYMENT_GUIDE.md         # Deployment instructions
```

---

## 🚀 Development Setup

### Prerequisites

- **Node.js** 18+ or 20+
- **PostgreSQL** database (local or cloud)
- **Cloudinary** account (free tier)
- **Brevo** account (free email API)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ICPC_MOCK

# Install backend dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed default admin
npm run prisma:seed

# Start backend server
npm run dev

# In another terminal, start frontend
cd frontend
npm install
npm start
```

### Access Your App

- **Registration Form:** http://localhost:5000/
- **Admin Panel:** http://localhost:5000/admin.html
- **Admin Email:** admin@example.com (set in seed)

---

## 🔧 Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/icpc_db"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your-secret-key-min-32-chars"

# Email Service (Brevo)
BREVO_API_KEY="your-brevo-api-key"
BREVO_FROM_EMAIL="noreply@yourdomain.com"
BREVO_FROM_NAME="ICE Committee"

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
```

---

## 📚 API Endpoints

### Registration
- `POST /api/register` - Register new student

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/students` - Fetch all students (protected)
- `POST /api/admin/select/:id` - Mark as selected (protected)
- `DELETE /api/admin/students/:id` - Delete student (protected)

### Upload
- `POST /api/upload` - Upload photo to Cloudinary

---

## 🧪 Testing

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Test Registration
1. Go to http://localhost:5000/
2. Fill form with test data
3. Upload a photo
4. Submit

### Test Admin
1. Go to http://localhost:5000/admin.html
2. Login with admin credentials
3. Test filters and actions

---

## 🚀 Deployment

### Option 1: Render (Recommended)

```bash
# See DEPLOYMENT_GUIDE.md for detailed steps

# Quick summary:
1. Push to GitHub
2. Create Web Service on Render
3. Add DATABASE_URL environment variable
4. Deploy!
```

### Option 2: Railway

```bash
1. Connect GitHub account
2. Create new project
3. Add PostgreSQL database
4. Deploy backend
5. Deploy frontend to Netlify/Vercel
```

### Option 3: Traditional VPS

```bash
1. SSH to server
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure .env
5. Run npm install and migrations
6. Use PM2 to manage process
```

**📖 See `DEPLOYMENT_GUIDE.md` for complete deployment instructions.**

---

## 🔒 Security

- ✅ Password hashing with bcryptjs
- ✅ JWT tokens in HttpOnly cookies
- ✅ CORS properly configured
- ✅ Input validation with Zod
- ✅ Environment variables protected
- ✅ API authentication required for sensitive endpoints
- ✅ SQL injection prevention via Prisma ORM
- ✅ File upload validation

---

## 📊 Database Schema

### Student Model
```prisma
model Student {
  id              String   @id @default(uuid())
  full_name       String
  ID_no           String
  batch           String?
  phone           String
  email           String   @unique
  department      String
  gender          String
  apply_for_post  String
  photo_url       String
  note            String?
  selected        Boolean  @default(false)
  createdAt       DateTime @default(now())
}
```

### Admin Model
```prisma
model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
}
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check environment variables
cat .env

# Generate Prisma client
npm run prisma:generate
```

### Database connection error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

### Email not sending
- Verify BREVO_API_KEY is correct
- Check email is valid
- Monitor Brevo dashboard for delivery status

### Photos not uploading
- Verify Cloudinary credentials
- Check file size (max 3MB)
- Verify file format (JPG, PNG)

---

## 📞 Support & Contribution

For issues, questions, or contributions, please:
1. Check existing documentation
2. Review error messages carefully
3. Check environment configuration
4. Consult hosting provider docs

---

## 📄 License

This project is private and confidential.

---

## ✅ Checklist Before Deployment

- [ ] All dependencies installed
- [ ] `.env` file configured
- [ ] Database migrations completed
- [ ] Admin seed completed
- [ ] Backend tested locally
- [ ] Frontend API URL updated
- [ ] CORS configuration correct
- [ ] SSL certificate ready (if needed)
- [ ] Email service tested
- [ ] File upload tested
- [ ] Admin dashboard tested

---

## 🎯 Next Steps

1. **Development:** Run `npm run dev` to start server
2. **Testing:** Fill forms and test all features
3. **Deployment:** Follow `DEPLOYMENT_GUIDE.md`
4. **Monitoring:** Set up error tracking
5. **Maintenance:** Regular backups and updates

---

**Ready to deploy? 🚀 See `DEPLOYMENT_GUIDE.md` for detailed instructions.**

Good luck with your ICE Committee Registration Portal!

### 5️⃣ Start Server

```bash
npm run dev
```

Server will run on: **http://localhost:5000**

### 6️⃣ Access the Application

- **Register:** http://localhost:5000/
- **Admin Login:** http://localhost:5000/login.html
- **Admin Dashboard:** http://localhost:5000/admin.html (after login)

### Demo Admin Credentials

```
Username: ice_dep
Password: ice_dep12

OR

Username: noor
Password: noorabdullah
```

## 📝 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Submit student registration |
| POST | `/api/upload` | Upload photo to Cloudinary |

### Admin Routes (Protected by JWT Cookie)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/students` | Fetch all students (with filters) |
| POST | `/api/select` | Select student & send email |
| DELETE | `/api/select/:id` | Delete student |
| POST | `/api/logout` | Logout (clear cookie) |

### Query Parameters for `/api/students`

```
GET /api/students?search=name&post=President&department=CSE
```

## 🗄️ Database Schema

### Student Model
```
id (UUID)
full_name (String)
ID_no (String)
Batch
phone (String)
email (String - unique)
department (String)
gender (String)
apply_for_post (String)
photo_url (String - Cloudinary URL)
note (String - optional)
selected (Boolean - default: false)
createdAt (DateTime)
```

### Admin Model
```
id (UUID)
username (String - unique)
password (String - hashed with bcrypt)
```

## 📧 Email Templates

### Registration Confirmation
```
Subject: Form Received - ICE Committee
Body: Hello {full_name}, Thanks for applying for {apply_for_post}. We will review your submission.
```

### Selection Notification
```
Subject: 🎉 Selected for Committee Position
Body: Hello {full_name}, You are selected for {apply_for_post}. Congratulations!
```

## 🛡️ Security Features

✅ **JWT Authentication** - Secure token-based admin access  
✅ **HttpOnly Cookies** - Prevents XSS attacks  
✅ **Password Hashing** - bcrypt for admin passwords  
✅ **Input Validation** - Zod schema validation  
✅ **CORS Protection** - Configured origins  
✅ **File Size Limits** - 3MB max for photos  
✅ **File Type Validation** - Only JPG/PNG allowed  

## 🚢 Deployment

### Option 1: Railway (Recommended)
1. Push code to GitHub
2. Connect Railway to GitHub repo
3. Add environment variables in Railway dashboard
4. Railway auto-detects Node.js and deploys

### Option 2: Vercel
1. Vercel doesn't support long-running servers well
2. Better to use Railway, Render, or Fly.io for Node backend
3. Frontend can be separate static deployment

### Option 3: Render
1. Create new Web Service on Render
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Environment Variables for Deployment
Set these in your deployment platform:
- `DATABASE_URL` - Neon PostgreSQL URL
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `BREVO_API_KEY`
- `JWT_SECRET` - Generate a strong random string
- `NODE_ENV` - Set to `production`
- `PORT` - Usually auto-set by platform (5000)

## 🔧 Troubleshooting

### Database Connection Error
```
Error: "Cannot connect to database"
→ Check DATABASE_URL in .env
→ Ensure Neon database is active
→ Verify IP whitelist in Neon settings
```

### Photo Upload Fails
```
Error: "Upload failed"
→ Check CLOUDINARY_* credentials
→ Verify file size < 3MB
→ Ensure file is JPG/PNG
```

### Admin Login Issues
```
Error: "Invalid credentials"
→ Run `npm run seed` to create default admins
→ Check username/password spelling
→ Verify JWT_SECRET is set
```

### Email Not Sending
```
Error: "Email send failed"
→ Verify BREVO_API_KEY is correct
→ Check BREVO_FROM_EMAIL matches account
→ Check email recipient inbox (spam folder)
→ Test API key in Brevo dashboard
```

## 📚 Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| @prisma/client | ORM |
| jsonwebtoken | JWT tokens |
| bcryptjs | Password hashing |
| cloudinary | Image upload |
| axios | HTTP requests |
| zod | Data validation |
| cookie-parser | Cookie handling |
| cors | Cross-origin requests |
| dotenv | Environment variables |

## 📝 All Comments in Banglish

All code files contain comments in **Banglish only** (Bengali-English mix):
```javascript
// Banglish comments sudhu
// Ei file student registration handle kore
```

This makes the code easy to understand for both Bengali and English speakers.

## 🎓 Admin Dashboard Features

- ✅ Dashboard statistics (Total, Selected, Pending)
- ✅ Real-time student list with auto-refresh every 10 seconds
- ✅ Search by name/email
- ✅ Filter by position & department
- ✅ Filter by selection status
- ✅ Photo preview modal
- ✅ One-click select (sends confirmation email)
- ✅ Delete student with confirmation
- ✅ Logout functionality

## 🌐 Responsive Design

- ✅ Mobile-friendly layout (320px+)
- ✅ Tablet optimized
- ✅ Desktop full width
- ✅ Touch-friendly buttons
- ✅ Responsive tables with horizontal scroll

## 🧪 Testing

### Manual Test Flow

1. **Register a student:**
   - Go to http://localhost:5000/
   - Fill form with valid data
   - Upload a PNG/JPG photo (< 3MB)
   - Click Submit
   - Check email for confirmation

2. **Admin login:**
   - Go to http://localhost:5000/login.html
   - Enter: `ice_dep` / `ice_dep12`
   - Click Login

3. **Admin select student:**
   - View dashboard
   - Click "Select" button on a pending student
   - Check email for selection notification
   - Student appears as "Selected"

4. **Admin delete student:**
   - Click "Delete" on any student
   - Confirm deletion
   - Student removed from list

## 📞 Support

For issues, check:
1. `.env` file has all required variables
2. Database connection is active
3. Cloudinary/Brevo API keys are valid
4. Browser console for frontend errors
5. Server logs for backend errors

## 📄 License

MIT License - Feel free to use for your project!

---


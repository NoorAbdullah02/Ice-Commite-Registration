# ICE Committee Registration Portal

Ei ekta production-ready Committee Registration system, banano **Node.js + Express + Vanilla JavaScript** diye, **PostgreSQL (Neon) + Prisma** diye.

## 🎯 Features

✅ Student Registration Form (HTML/CSS/JS)  
✅ Photo Upload to Cloudinary (3MB limit, JPG/PNG)  
✅ Automatic Email Confirmation (Brevo API)  
✅ Admin Panel with JWT Auth (HttpOnly cookies)  
✅ Dashboard Statistics & Filtering  
✅ Select Candidates & Send Selection Email  
✅ Delete Student Records  
✅ Fully Responsive UI  
✅ All Comments in Banglish  

## 📁 Project Structure

```
project/
 ├── backend/
 │   ├── server.js              # Express server entry point
 │   ├── routes/
 │   │   ├── register.js        # Student registration API
 │   │   ├── adminLogin.js      # Admin login & JWT
 │   │   ├── students.js        # Fetch students (admin)
 │   │   ├── select.js          # Select & delete students
 │   │   └── upload.js          # Cloudinary upload
 │   ├── middleware/
 │   │   └── auth.js            # JWT verification middleware
 │   └── utils/
 │       ├── jwt.js             # Token sign/verify
 │       ├── cloudinary.js      # Image upload helper
 │       └── email.js           # Brevo email sender
 ├── frontend/
 │   ├── index.html             # Registration page
 │   ├── admin.html             # Admin dashboard
 │   ├── login.html             # Admin login
 │   ├── success.html           # Success page
 │   ├── style.css              # Global styles
 │   ├── script.js              # Registration form JS
 │   ├── login.js               # Login form JS
 │   └── admin.js               # Dashboard JS
 ├── prisma/
 │   ├── schema.prisma          # Database schema
 │   └── seed.js                # Seed default admins
 ├── .env                       # Environment variables (git-ignored)
 ├── .env.example               # Example environment file
 ├── package.json               # Dependencies
 └── README.md                  # This file
```

## 🚀 Quick Start

### 1️⃣ Prerequisites
- Node.js 16+ installed
- PostgreSQL database (Neon account)
- Cloudinary account
- Brevo (SendInBlue) account

### 2️⃣ Clone & Install

```bash
cd ICPC_MOCK
npm install
```

### 3️⃣ Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
BREVO_API_KEY="..."
JWT_SECRET="..."
PORT=5000
```

### 4️⃣ Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration (initial schema)
npm run prisma:migrate

# Seed default admins
npm run seed
```

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


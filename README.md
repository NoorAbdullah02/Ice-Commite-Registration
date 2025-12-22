# ICE Committee Registration System

A modern, production-ready web application for managing ICE Committee member registrations and selections. Built with Node.js, Express, Prisma, PostgreSQL, and modern frontend technologies.

## 🎯 Features

### ✨ Core Features
- **Student Registration**: Easy-to-use registration form with validation
- **Photo Upload**: Cloudinary integration for reliable image hosting
- **Admin Dashboard**: Comprehensive admin panel for managing applications
- **Selection Management**: Bulk selection and individual student management
- **Email Notifications**: Automated emails using Brevo API
- **Position Management**: Dynamic position assignment system

### 🔒 Security Features
- JWT authentication with secure cookies
- Rate limiting for login attempts
- Input validation and sanitization
- CORS protection
- XSS and security headers
- Password hashing with bcryptjs

### 📱 Responsive Design
- Mobile-first approach
- Desktop, tablet, and mobile optimization
- Works on all modern browsers
- Touch-friendly interface

### ⚡ Performance
- Database query optimization with caching
- Lazy loading and image optimization
- Minimal bundle size
- Fast API response times

## 📋 Prerequisites

- Node.js >= 14.0
- PostgreSQL database
- Cloudinary account (for image uploads)
- Brevo account (for email sending)
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ice-Commite-Registration
```

### 2. Install Dependencies
```bash
npm run setup
# or
cd backend && npm install && cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create `.env` file in the `backend` directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Email Service (Brevo)
BREVO_API_KEY="your_brevo_api_key"
BREVO_FROM_EMAIL="noreply@yourdomain.com"
BREVO_FROM_NAME="ICE Committee"
ADMIN_EMAIL="admin@yourdomain.com"

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# App Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-key-change-in-production"
```

### 4. Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

### 5. Seed Default Data (Optional)

```bash
npx prisma db seed
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

### Production Build

```bash
npm run backend:start
```

## 📚 API Documentation

### Authentication Endpoints

#### Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
  "username": "ice_dep",
  "password": "ice_dep12"
}
```

#### Logout
```
POST /api/admin/logout
```

### Registration Endpoints

#### Register Student
```
POST /api/register/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "ID_no": "123456",
  "batch": "2023",
  "phone": "+918123456789",
  "email": "john@example.com",
  "department": "CSE",
  "gender": "Male",
  "apply_for_post": "President",
  "photo_url": "https://...",
  "note": "Optional note"
}
```

#### Check Email Availability
```
GET /api/register/check-email/john@example.com
```

### Photo Upload Endpoints

#### Upload Photo
```
POST /api/upload
Content-Type: multipart/form-data

[File: photo (max 5MB, JPG/PNG/WebP/GIF)]
```

#### Validate Photo
```
POST /api/upload/validate
Content-Type: multipart/form-data

[File: photo]
```

### Student Management Endpoints

#### Get All Students (Admin Only)
```
GET /api/students?page=1&limit=50&search=john&post=President

Headers:
Cookie: token=<jwt_token>
```

#### Get Statistics
```
GET /api/students/stats

Headers:
Cookie: token=<jwt_token>
```

#### Export Students
```
GET /api/students/export?format=json&selected=all

Headers:
Cookie: token=<jwt_token>
```

### Selection Endpoints

#### Select Single Student
```
POST /api/select
Content-Type: application/json

{
  "studentId": "uuid"
}

Headers:
Cookie: token=<jwt_token>
```

#### Bulk Select Students
```
POST /api/select/bulk
Content-Type: application/json

{
  "studentIds": ["uuid1", "uuid2", "uuid3"]
}

Headers:
Cookie: token=<jwt_token>
```

#### Deselect Student
```
POST /api/select/deselect
Content-Type: application/json

{
  "studentId": "uuid"
}

Headers:
Cookie: token=<jwt_token>
```

#### Delete Student
```
DELETE /api/select/:id

Headers:
Cookie: token=<jwt_token>
```

### Position Management Endpoints

#### Update Student Position
```
PUT /api/update-post/:id
Content-Type: application/json

{
  "apply_for_post": "Vice President",
  "sendEmail": true
}

Headers:
Cookie: token=<jwt_token>
```

#### Get Valid Positions
```
GET /api/update-post/valid-posts

Headers:
Cookie: token=<jwt_token>
```

#### Bulk Update Positions
```
PUT /api/update-post/bulk
Content-Type: application/json

{
  "updates": [
    { "studentId": "uuid1", "newPost": "Secretary" },
    { "studentId": "uuid2", "newPost": "Member" }
  ]
}

Headers:
Cookie: token=<jwt_token>
```

## 🏗️ Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── register.js          # Registration endpoints
│   │   ├── adminLogin.js        # Admin authentication
│   │   ├── students.js          # Student listing and stats
│   │   ├── select.js            # Selection endpoints
│   │   ├── upload.js            # Photo upload
│   │   └── updatePost.js        # Position management
│   ├── utils/
│   │   ├── email.js             # Email templates and sending
│   │   ├── jwt.js               # JWT token operations
│   │   └── cloudinary.js        # Image upload and optimization
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   ├── server.js                # Express server setup
│   └── package.json
│
├── frontend/
│   ├── index.html               # Registration form
│   ├── login.html               # Admin login
│   ├── admin.html               # Admin dashboard
│   ├── script.js                # Registration form JS
│   ├── login.js                 # Login form JS
│   ├── admin.js                 # Dashboard JS
│   ├── config.js                # Frontend config
│   └── styles/
│       ├── style.css            # Registration styling
│       ├── login-style.css      # Login styling
│       └── style_admin.css      # Dashboard styling
│
├── .env.example                 # Environment template
├── package.json                 # Root package config
└── README.md                    # This file
```

## 🔐 Default Admin Credentials

```
Username: ice_dep
Password: ice_dep12

OR

Username: noor
Password: noorabdullah
```

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## 📊 Database Schema

### Student Model
```
- id: String (UUID, PK)
- full_name: String
- ID_no: String
- batch: String (optional)
- phone: String
- email: String (unique)
- department: String
- gender: String
- apply_for_post: String
- photo_url: String
- note: String (optional)
- selected: Boolean
- createdAt: DateTime
```

### Admin Model
```
- id: String (UUID, PK)
- username: String (unique)
- password: String (hashed)
```

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ice_dep","password":"ice_dep12"}'
```

### Test Registration
```bash
curl -X POST http://localhost:5000/api/register/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "ID_no": "TEST001",
    "phone": "+918123456789",
    "email": "test@example.com",
    "department": "CSE",
    "gender": "Male",
    "apply_for_post": "Member",
    "photo_url": "https://example.com/photo.jpg"
  }'
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
npm run build
vercel deploy
```

### Deploy to Render (Backend)
1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check network connectivity

### Email Not Sending
- Verify Brevo API key
- Check email configuration
- Verify sender email is authorized

### Image Upload Fails
- Check Cloudinary credentials
- Verify file size < 5MB
- Ensure image format is supported

### CORS Errors
- Check `FRONTEND_URL` in `.env`
- Verify origin is in allowed list
- Clear browser cache

## 📈 Performance Optimization

- Database query caching (30-second TTL)
- Image optimization with WebP format
- Lazy loading for images
- Pagination for large datasets
- Debounced API calls
- Minified and optimized assets

## 🔄 API Rate Limiting

- 5 login attempts per 15 minutes per IP
- 100 requests per 15 minutes per client
- 1000 student updates per request

## 📝 Code Quality

- ESLint compliant
- Comprehensive error handling
- Input validation and sanitization
- TypeScript-ready structure
- Clean code principles

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC License - See LICENSE file for details

## 📞 Support

For issues, questions, or suggestions:
- Email: admin@example.com
- GitHub Issues: [repository]/issues

## 🎉 Acknowledgments

Built with modern web technologies:
- Express.js - Web framework
- Prisma - Database ORM
- PostgreSQL - Database
- Cloudinary - Image hosting
- Brevo - Email service
- Zod - Validation

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅

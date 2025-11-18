# 🎯 COMPLETE RUNNING INSTRUCTIONS

## 📍 YOU ARE HERE

✅ Project completely built  
✅ All files created  
✅ Dependencies installed  
❓ Database needs activation  

---

## ⚡ START HERE (COPY-PASTE THESE COMMANDS)

### Step 1: Activate Neon Database (IMPORTANT!)
```
1. Go to: https://console.neon.tech
2. Log in with your credentials
3. Find project "neondb"
4. Check if status is GREEN (ACTIVE)
5. If status is ORANGE/RED, click to activate
6. Wait for it to turn GREEN
7. Copy connection string from "Connection Details"
```

### Step 2: Update .env if needed
```bash
# If you got new connection string from Neon:
nano .env
# Replace DATABASE_URL with new one
# Press Ctrl+X then Y to save
```

### Step 3: Run These Commands (In Terminal)
```bash
cd /home/noor-abdullah/Desktop/ICPC_MOCK

# Create database tables
npx prisma migrate dev --name init

# When prompted: "Enter a name for the new migration:" 
# Type: init
# Press Enter

# Create default admin users
npm run seed

# Start the server
npm run dev
```

### Step 4: Open In Browser
```
Registration: http://localhost:5000/
Admin Login: http://localhost:5000/login.html
```

---

## ✅ EXPECTED OUTPUT

### After `npx prisma migrate dev --name init`:
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
✔ A new migration to create the database schema is being created...
✔ A migration has been created with your new schema changes
✔ Successfully ran 2 migrations and synced Prisma schema with database
```

### After `npm run seed`:
```
🌱 Seeding database...
✅ Admin created: ice_dep
✅ Admin created: noor
✨ Seeding complete!
```

### After `npm run dev`:
```
🚀 Server running on http://localhost:5000
📝 Register: http://localhost:5000/
🔐 Admin: http://localhost:5000/login.html
```

---

## 🌐 URLS TO ACCESS

```
┌─────────────────────────────────────────────────┐
│                 APPLICATION URLs                │
├─────────────────────────────────────────────────┤
│ HOME                                            │
│ http://localhost:5000/                          │
├─────────────────────────────────────────────────┤
│ STUDENT REGISTRATION                            │
│ http://localhost:5000/                          │
├─────────────────────────────────────────────────┤
│ ADMIN LOGIN                                     │
│ http://localhost:5000/login.html                │
├─────────────────────────────────────────────────┤
│ ADMIN DASHBOARD (after login)                   │
│ http://localhost:5000/admin.html                │
├─────────────────────────────────────────────────┤
│ DATABASE VIEWER                                 │
│ npx prisma studio → http://localhost:5555      │
├─────────────────────────────────────────────────┤
│ SERVER HEALTH                                   │
│ http://localhost:5000/health                    │
└─────────────────────────────────────────────────┘
```

---

## 🔑 ADMIN LOGIN CREDENTIALS

```
┌────────────────────────────────────────┐
│         ADMIN #1                       │
├────────────────────────────────────────┤
│ Username: ice_dep                      │
│ Password: ice_dep12                    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│         ADMIN #2                       │
├────────────────────────────────────────┤
│ Username: noor                         │
│ Password: noorabdullah                 │
└────────────────────────────────────────┘
```

---

## 🧪 TEST WORKFLOW (5 MINUTES)

### Test 1: Register a Student
```
1. Open: http://localhost:5000/
2. Fill form:
   ✓ Full Name: John Doe
   ✓ ID: 12345
   ✓ Phone: 01234567890
   ✓ Email: john@example.com
   ✓ Department: CSE
   ✓ Gender: Male
   ✓ Post: President
   ✓ Note: Testing
3. Upload a JPEG/PNG photo (< 3MB)
4. Click "Submit Registration"
5. ✅ Should see: "Registration successful!"
6. Redirects to: http://localhost:5000/success.html
```

### Test 2: Check Email
```
1. Check your email (john@example.com)
2. Should receive: "Form Received - ICE Committee"
3. ✅ Email contains registration confirmation
```

### Test 3: Admin Login
```
1. Open: http://localhost:5000/login.html
2. Enter:
   ✓ Username: ice_dep
   ✓ Password: ice_dep12
3. Click "Login"
4. ✅ Should redirect to: http://localhost:5000/admin.html
```

### Test 4: Admin Dashboard
```
1. See statistics:
   ✓ Total Candidates: 1
   ✓ Selected: 0
   ✓ Pending: 1
2. Find student in table (John Doe)
3. Click photo thumbnail
4. ✅ Should show photo preview modal
5. Close modal (click X)
```

### Test 5: Select Student
```
1. Click "Select" button for student
2. ✅ Should show: "Student selected! Email sent."
3. Check email for selection notification
4. Should receive: "🎉 Selected for Committee Position"
5. Status changes to: "Selected" badge
```

### Test 6: Delete Student
```
1. Click "Delete" button
2. Confirm deletion
3. ✅ Student removed from list
4. Statistics update automatically
```

---

## 🛑 TROUBLESHOOTING

### Issue: "Can't reach database server"
**Solution:**
```bash
# 1. Go to Neon: https://console.neon.tech
# 2. Check database is ACTIVE (green status)
# 3. If not, click to activate it
# 4. Wait 30 seconds
# 5. Try again:
npx prisma migrate dev --name init
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill the process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: "npm install failed"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm install multer
```

### Issue: "Admin login fails"
**Solution:**
```bash
# Check if seed ran successfully:
npm run seed

# Verify credentials:
# Username: ice_dep
# Password: ice_dep12
```

### Issue: "Photo upload fails"
**Solution:**
```bash
# Check file size < 3MB
# Check file type is JPG or PNG
# Check Cloudinary credentials in .env:
grep CLOUDINARY .env
```

### Issue: "Email not sending"
**Solution:**
```bash
# Check Brevo API key:
grep BREVO_API_KEY .env

# Verify email in .env:
grep BREVO_FROM_EMAIL .env

# Check recipient email is valid
```

---

## 📊 MONITORING

### Check Database
```bash
# View data with GUI
npx prisma studio
# Opens: http://localhost:5555
```

### View Server Logs
```bash
# Terminal shows all requests and errors
npm run dev

# Or save to file:
npm run dev > server.log 2>&1
tail -f server.log
```

### Check Database Connection
```bash
# Test the connection
psql "$DATABASE_URL" -c "SELECT 1"

# Should return:
#  ?column?
# ----------
#         1
```

---

## 🔄 IMPORTANT FILES TO KNOW

```
backend/server.js              → Main server entry point
prisma/schema.prisma           → Database schema
prisma/seed.js                 → Creates default admins
.env                           → Environment variables
frontend/index.html            → Registration form
frontend/admin.html            → Admin dashboard
frontend/admin.js              → Dashboard functionality
```

---

## ✨ FEATURES READY TO USE

✅ Student registration form  
✅ Photo upload to Cloudinary  
✅ Automatic confirmation emails  
✅ Admin authentication with JWT  
✅ Admin dashboard with statistics  
✅ Search & filter students  
✅ Photo preview modal  
✅ Select student & send email  
✅ Delete student records  
✅ Fully responsive design  
✅ All comments in Banglish  

---

## 🚀 NEXT STEPS AFTER RUNNING

1. Test all features (see Test Workflow above)
2. Verify emails arrive in inbox
3. Check database in Prisma Studio
4. Customize form fields (if needed)
5. Deploy to Railway/Render (when ready)

---

## 📝 COMMAND QUICK REFERENCE

```bash
# Start development
npm run dev

# Start production
npm start

# View database
npx prisma studio

# Seed admins
npm run seed

# Create migration
npx prisma migrate dev --name <name>

# Reset database (WARNING: loses data)
npx prisma migrate reset

# Check dependencies
npm list

# Update packages
npm update
```

---

## 🎯 FINAL CHECKLIST

Before declaring success:

- [ ] npm install completed
- [ ] Neon database ACTIVATED
- [ ] Database migration ran (npx prisma migrate dev --name init)
- [ ] Admins seeded (npm run seed)
- [ ] Server started (npm run dev)
- [ ] Can access http://localhost:5000
- [ ] Registration form works
- [ ] Photo uploads successfully
- [ ] Confirmation email received
- [ ] Can login with ice_dep/ice_dep12
- [ ] Admin dashboard shows statistics
- [ ] Can select a student
- [ ] Selection email received
- [ ] Can delete a student

---

## 🎉 YOU'RE READY!

Run these 3 commands and you're done:

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Then open: **http://localhost:5000** in your browser! 🚀

---

**Questions?** Check SETUP_GUIDE.md or README.md for detailed information.

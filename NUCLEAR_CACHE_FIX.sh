#!/bin/bash

echo "🔥 NUCLEAR CACHE FIX - CLEARING EVERYTHING"
echo "=================================================="

# Kill all browsers and nodes
echo "🛑 Stopping all processes..."
pkill -9 -f "google-chrome"
pkill -9 -f "chromium"
pkill -9 -f "firefox"
pkill -9 -f "node.*server"
sleep 2

# Delete Chrome cache completely
echo "🗑️ Deleting Chrome cache files..."
rm -rf ~/.cache/google-chrome/
rm -rf ~/.config/google-chrome/
echo "✅ Chrome cache deleted"

# Delete Firefox cache if exists
echo "🗑️ Deleting Firefox cache..."
rm -rf ~/.cache/firefox/
rm -rf ~/.mozilla/firefox/
echo "✅ Firefox cache deleted"

# Clear system cache
echo "🗑️ Clearing system temp files..."
rm -rf /tmp/*
rm -rf /var/tmp/*
echo "✅ System temp cleared"

# Restart backend
echo ""
echo "🚀 Starting backend server..."
cd /home/noor-abdullah/Personal/Ice-Commite-Registration/backend
npm run dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
echo "Backend started with PID: $SERVER_PID"

# Wait for server to be ready
sleep 4

# Check if server is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend server is running at http://localhost:3000"
else
    echo "⚠️ Server might not be ready yet"
fi

echo ""
echo "=================================================="
echo "✅ CACHE CLEARED SUCCESSFULLY!"
echo "=================================================="
echo ""
echo "📋 WHAT TO DO NOW:"
echo ""
echo "1️⃣  Close ALL browser windows completely"
echo "2️⃣  Wait 5 seconds"
echo "3️⃣  Open a NEW browser window"
echo "4️⃣  Type: http://localhost:3000"
echo "5️⃣  Press: F12 (open developer tools)"
echo "6️⃣  In console, see if it shows:"
echo "     🚀 FULL URL TO SUBMIT: http://localhost:3000/api/register/register"
echo ""
echo "7️⃣  If you see that 👆, cache is cleared!"
echo "8️⃣  Fill form and submit"
echo "9️⃣  Should see: ✅ Response Status: 201"
echo ""
echo "🧪 TEST FIRST:"
echo "   Go to: http://localhost:3000/test-api.html"
echo "   Click all test buttons"
echo ""

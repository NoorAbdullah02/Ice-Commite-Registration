#!/bin/bash

# 🔧 LINUX CACHE CLEARING SCRIPT FOR YOU
# Run this script to completely clear browser cache and restart everything

echo "🧹 Clearing browser cache..."

# Kill any running Node processes
pkill -f "node.*server.js"
echo "✅ Stopped backend server"

# Wait a moment
sleep 2

# Clear Chrome cache
rm -rf ~/.cache/google-chrome/
rm -rf ~/.config/google-chrome/Default/Cache/
rm -rf ~/.config/google-chrome/Default/Code\ Cache/
echo "✅ Cleared Chrome cache"

# Clear Firefox cache if it exists
rm -rf ~/.cache/firefox/
rm -rf ~/.mozilla/firefox/*/cache*
echo "✅ Cleared Firefox cache (if exists)"

# Restart backend
cd /home/noor-abdullah/Personal/Ice-Commite-Registration/backend
echo "🚀 Restarting backend server..."
npm run dev &

# Wait for server to start
sleep 3

# Verify server is running
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend server is running!"
else
    echo "❌ Backend server failed to start"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL CACHE CLEARED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Close your browser completely"
echo "2. Reopen browser"
echo "3. Go to: http://localhost:3000"
echo "4. Press: Ctrl+Shift+Delete"
echo "5. Select 'All time' and 'Cached images and files'"
echo "6. Click 'Clear data'"
echo "7. Hard refresh: Ctrl+Shift+R"
echo "8. Open console: F12"
echo "9. Fill and submit form"
echo "10. Check console for: ✅ Response Status: 201"
echo ""
echo "Test page: http://localhost:3000/test-api.html"
echo ""

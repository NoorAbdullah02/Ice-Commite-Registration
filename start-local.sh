#!/bin/bash

# 🚀 QUICK LOCAL STARTUP SCRIPT
# Run this to start everything locally

echo "════════════════════════════════════════"
echo "  ICPC REGISTRATION - LOCAL STARTUP"
echo "════════════════════════════════════════"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from: https://nodejs.org"
    exit 1
fi

echo "✅ Node version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to project root
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo "📂 Project directory: $PROJECT_DIR"
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env not found!"
    echo "Please create it with the required variables."
    echo ""
    echo "Required variables:"
    echo "  - DATABASE_URL"
    echo "  - BREVO_API_KEY"
    echo "  - CLOUDINARY_NAME"
    echo "  - CLOUDINARY_KEY"
    echo "  - CLOUDINARY_SECRET"
    echo "  - JWT_SECRET"
    echo "  - ADMIN_PASSWORD"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

cd backend || exit 1
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install --silent
    npm run prisma:generate --silent
fi
echo "✅ Backend ready"
cd ..

cd frontend || exit 1
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --silent
fi
echo "✅ Frontend ready"
cd ..

echo ""
echo "════════════════════════════════════════"
echo "  STARTUP INSTRUCTIONS"
echo "════════════════════════════════════════"
echo ""
echo "📍 Open 2 TERMINALS:"
echo ""
echo "TERMINAL 1 - Backend:"
echo "  cd $(pwd)/backend"
echo "  npm run dev"
echo ""
echo "TERMINAL 2 - Frontend:"
echo "  cd $(pwd)/frontend"
echo "  npm start"
echo ""
echo "🌐 Then open in browser:"
echo "  http://localhost:3000"
echo ""
echo "════════════════════════════════════════"
echo ""

# Try to start servers if user wants
read -p "Start backend now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd backend
    npm run dev
else
    echo "Manual startup needed. Follow instructions above."
fi

#!/bin/bash

# 🚀 ICE Committee Registration - Quick Setup Script

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║     🎓 ICE Committee Registration Portal - Setup Script       ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}1. Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js not installed. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"
echo ""

# Backend setup
echo -e "${BLUE}2. Setting up Backend...${NC}"
cd backend || exit 1
echo "   Installing dependencies..."
npm install --silent
echo -e "${GREEN}   ✅ Backend dependencies installed${NC}"

echo "   Generating Prisma client..."
npm run prisma:generate --silent
echo -e "${GREEN}   ✅ Prisma client generated${NC}"

# Check .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}   ⚠️  .env file not found. Copying from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}   📝 Please update .env with your credentials${NC}"
    fi
fi
echo ""

# Frontend setup
echo -e "${BLUE}3. Setting up Frontend...${NC}"
cd ../frontend || exit 1
echo "   Installing dependencies..."
npm install --silent
echo -e "${GREEN}   ✅ Frontend dependencies installed${NC}"
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Setup Complete!                          ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║                                                               ║"
echo -e "║  ${GREEN}Next steps:${NC}                                            ║"
echo "║                                                               ║"
echo "║  1. Configure environment variables:                         ║"
echo "║     cd backend && nano .env                                  ║"
echo "║                                                               ║"
echo "║  2. Run database migrations:                                 ║"
echo "║     npm run prisma:migrate                                   ║"
echo "║                                                               ║"
echo "║  3. Start backend server:                                    ║"
echo "║     npm run dev                                              ║"
echo "║                                                               ║"
echo "║  4. Start frontend (in another terminal):                    ║"
echo "║     cd frontend && npm start                                 ║"
echo "║                                                               ║"
echo "║  5. Access your app:                                         ║"
echo "║     Registration: http://localhost:5000/                     ║"
echo "║     Admin: http://localhost:5000/admin.html                  ║"
echo "║                                                               ║"
echo "║  📖 See DEPLOYMENT_GUIDE.md for deployment instructions      ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

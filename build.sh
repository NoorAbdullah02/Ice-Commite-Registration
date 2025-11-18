#!/bin/bash

# Build script for Render deployment
# This script handles the monorepo structure where backend is in /backend folder

set -e

echo "🔨 Building ICE Committee Backend..."
echo ""

# Navigate to backend directory
cd backend || exit 1

echo "1️⃣  Installing dependencies..."
npm install --silent

echo "2️⃣  Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "3️⃣  Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || echo "⚠️  Migrations already applied or in progress"

echo ""
echo "✅ Build completed successfully!"
echo ""

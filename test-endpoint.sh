#!/bin/bash

# Test script to verify /api/register endpoint

echo "🧪 Testing /api/register endpoint"
echo "================================="
echo ""

# Check if backend is running
echo "1️⃣  Checking if backend is running on port 5000..."
curl -s http://localhost:5000/health > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend is NOT running on port 5000"
    echo ""
    echo "To fix:"
    echo "  1. cd backend"
    echo "  2. npm run dev"
    echo ""
    exit 1
fi

echo ""
echo "2️⃣  Testing /api/register endpoint..."
echo ""
echo "Making POST request to http://localhost:5000/api/register"
echo ""

# Make test request
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Student",
    "ID_no": "TEST123",
    "batch": "14",
    "phone": "01748269350",
    "email": "test@example.com",
    "department": "ICE",
    "gender": "Male",
    "apply_for_post": "President",
    "photo_url": "https://res.cloudinary.com/dseibtclb/image/upload/v1763470677/ice_committee/Imran.jpg",
    "note": "Test submission"
  }' \
  -w "\n\n📊 HTTP Status: %{http_code}\n"

echo ""
echo "✅ Test complete!"
echo ""
echo "Expected responses:"
echo "  ✅ 201 = Success (route working)"
echo "  ❌ 404 = Route not found (backend not restarted?)"
echo "  ❌ 400 = Validation error (check fields)"
echo "  ❌ 500 = Server error (check backend logs)"

#!/usr/bin/env bash
set -e

echo "👑 Abu Ahmed Collection - Local Environment Setup"
echo "=================================================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ NPM version: $(npm -v)"

# Setup server environment
if [ ! -f "server/.env" ]; then
    echo "⚙️ Creating server/.env from template..."
    cp server/.env.example server/.env
    echo "✓ server/.env created."
else
    echo "✓ server/.env already exists."
fi

# Install server packages
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Install client packages
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo "=================================================="
echo "To seed the database with authentic sarees & admin account:"
echo "  cd server && npm run seed"
echo ""
echo "To start the application:"
echo "  1. In terminal 1 (Backend): cd server && npm run dev"
echo "  2. In terminal 2 (Frontend): cd client && npm run dev"
echo ""
echo "Website will run on http://localhost:3000"
echo "Admin panel on http://localhost:3000/admin (admin@abuahmedcollection.com / admin12345)"

#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║    SnapShop Setup Script              ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Create public directory
echo "📁 Creating public directory..."
mkdir -p public

# Move index.html to public if it exists in root
if [ -f "index.html" ]; then
    mv index.html public/
    echo "✓ Moved index.html to public/"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create data directory
echo ""
echo "📁 Creating data directory..."
mkdir -p data

# Copy .env.example to .env if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✓ Created .env file from .env.example"
    fi
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  ✓ Setup Complete!                    ║"
echo "╠════════════════════════════════════════╣"
echo "║  Next steps:                           ║"
echo "║  1. Run: npm start                     ║"
echo "║  2. Open: http://localhost:3000        ║"
echo "╚════════════════════════════════════════╝"

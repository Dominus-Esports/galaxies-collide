#!/bin/bash
# Galaxies Collide - Realistic Deployment Script

echo "🚀 Deploying Galaxies Collide..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Run tests
echo "🧪 Running tests..."
npm run test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ Tests passed"

# Deploy to Vercel (if configured)
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
else
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "📋 Manual deployment steps:"
    echo "1. Push to GitHub"
    echo "2. Connect to Vercel"
    echo "3. Deploy automatically"
fi

echo "🎉 Deployment complete!"
echo "🌍 Your game should be live at: https://your-project.vercel.app"

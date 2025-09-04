#!/bin/bash

# 🚀 Quick Deployment Script for Netlify

echo "🚀 Preparing for Netlify deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ No git repository found. Initializing..."
    git init
    git remote add origin YOUR_GITHUB_REPO_URL
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy to Netlify: $(date +"%Y-%m-%d %H:%M:%S")"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin master

echo "✅ Files pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Connect GitHub and select your repository"
echo "4. Deploy settings will be auto-detected from netlify.toml"
echo "5. Click 'Deploy site'"
echo ""
echo "🎉 Your site will be live in minutes!"

# Open Netlify in browser (optional)
# Uncomment the next line if you want to auto-open Netlify
# start https://netlify.com

@echo off
echo 🚀 Preparing for Netlify deployment...

REM Check if git is initialized
if not exist ".git" (
    echo ❌ No git repository found. Initializing...
    git init
    echo ⚠️  Don't forget to add your GitHub remote:
    echo git remote add origin YOUR_GITHUB_REPO_URL
    pause
)

REM Add all files
echo 📁 Adding files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy to Netlify: %date% %time%"

REM Push to GitHub
echo 🌐 Pushing to GitHub...
git push -u origin master

echo ✅ Files pushed to GitHub!
echo.
echo 📋 Next steps:
echo 1. Go to https://netlify.com
echo 2. Click 'New site from Git'
echo 3. Connect GitHub and select your repository
echo 4. Deploy settings will be auto-detected from netlify.toml
echo 5. Click 'Deploy site'
echo.
echo 🎉 Your site will be live in minutes!

REM Open Netlify in browser
start https://netlify.com

pause

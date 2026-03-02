#!/bin/bash

echo "🚀 GitHub Pages Setup for Ankle Strength Trainer"
echo "================================================"
echo ""
echo "Your code is ready to push! Follow these steps:"
echo ""
echo "Step 1: Create a GitHub repository"
echo "  1. Go to: https://github.com/new"
echo "  2. Repository name: ankle-strength-trainer"
echo "  3. Description: Progressive Web App for ankle strengthening exercises"
echo "  4. Public repository (required for free GitHub Pages)"
echo "  5. DO NOT initialize with README, .gitignore, or license"
echo "  6. Click 'Create repository'"
echo ""
echo "Step 2: Copy YOUR repository URL"
echo "  After creating the repo, GitHub will show you a URL like:"
echo "  https://github.com/YOUR_USERNAME/ankle-strength-trainer.git"
echo ""
echo "Step 3: Run these commands (replace YOUR_USERNAME):"
echo ""
echo "  cd ~/claude_personal/strength-app"
echo "  git remote add origin https://github.com/YOUR_USERNAME/ankle-strength-trainer.git"
echo "  git push -u origin main"
echo ""
echo "Step 4: Enable GitHub Pages"
echo "  1. Go to your repo on GitHub"
echo "  2. Click Settings → Pages (left sidebar)"
echo "  3. Source: Deploy from a branch"
echo "  4. Branch: main, folder: / (root)"
echo "  5. Click Save"
echo ""
echo "Step 5: Wait 1-2 minutes, then visit:"
echo "  https://YOUR_USERNAME.github.io/ankle-strength-trainer/"
echo ""
echo "Step 6: Install on iPhone"
echo "  1. Open that URL in Safari on your iPhone"
echo "  2. Tap Share → Add to Home Screen"
echo "  3. The app now works standalone!"
echo ""
echo "================================================"
echo ""
read -p "Have you created the GitHub repo? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    read -p "Enter your GitHub username: " username
    read -p "Enter repository name (or press Enter for 'ankle-strength-trainer'): " reponame
    reponame=${reponame:-ankle-strength-trainer}

    echo ""
    echo "Adding remote and pushing..."
    git remote add origin "https://github.com/$username/$reponame.git"
    git push -u origin main

    echo ""
    echo "✅ Code pushed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/$username/$reponame/settings/pages"
    echo "2. Enable GitHub Pages (Branch: main, folder: /)"
    echo "3. Wait 1-2 minutes"
    echo "4. Visit: https://$username.github.io/$reponame/"
    echo "5. Install on your iPhone!"
fi

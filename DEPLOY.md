# GitHub Pages Deployment - Quick Steps

## ✅ Already Done
- Git repository initialized
- All files committed
- Icons created
- Ready to push

## 🚀 Deploy Now (3 Steps)

### Step 1: Create GitHub Repository
1. Visit: **https://github.com/new**
2. Repository name: `ankle-strength-trainer`
3. Make it **Public**
4. **Do NOT** check any initialization options
5. Click **Create repository**

### Step 2: Push Your Code

```bash
cd ~/claude_personal/strength-app

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ankle-strength-trainer.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to: `https://github.com/YOUR_USERNAME/ankle-strength-trainer/settings/pages`
2. Under "Source": Select **main** branch
3. Folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes

### Your App URL
```
https://YOUR_USERNAME.github.io/ankle-strength-trainer/
```

## 📱 Install on iPhone

1. Open the URL above in **Safari** on your iPhone
2. Tap the **Share** button (square with arrow)
3. Scroll down, tap **Add to Home Screen**
4. Tap **Add**
5. Done! The app icon appears on your home screen

## 🎯 Benefits

✅ Works completely offline after installation
✅ No server needed
✅ Updates when you push to GitHub
✅ Free hosting forever
✅ Accessible from anywhere

## 🔄 Updating the App

When you make changes:

```bash
cd ~/claude_personal/strength-app
git add .
git commit -m "Description of changes"
git push
```

Wait 1-2 minutes, refresh the app URL, and changes go live!

---

## Alternative: Interactive Script

Run the guided setup:
```bash
./deploy-to-github.sh
```

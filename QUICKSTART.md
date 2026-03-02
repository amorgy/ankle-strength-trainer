# Quick Start Guide

## Setup (5 minutes)

### Step 1: Generate Icons
1. Open `icon-generator.html` in your browser
2. Download both icons (192x192 and 512x512)
3. Move them to `assets/icons/` folder

### Step 2: Start Local Server
Choose one method:

**Python (easiest):**
```bash
cd strength-app
python3 -m http.server 8000
```

**Node.js:**
```bash
cd strength-app
npx serve -p 8000
```

**PHP:**
```bash
cd strength-app
php -S localhost:8000
```

### Step 3: Test in Browser
1. Open `http://localhost:8000` in your browser
2. You should see the Dashboard with "Welcome! 💪"
3. Navigate through all tabs to verify everything works

## Testing the App

### 1. Browse Exercises
- Go to **Exercises** tab
- You should see 11 pre-loaded ankle exercises
- Click one to view details

### 2. Create a Routine
- Go to **Routines** tab
- Click **+ Create New Routine**
- Name it "Morning Routine"
- Add 3-4 exercises
- Save

### 3. Schedule a Workout
- Go to **Calendar** tab
- Click today's date
- Select your routine
- Save

### 4. Test Active Workout
- Go back to **Dashboard**
- Click **Start Now** on today's workout
- Try completing a set
- Watch the 30-second timer countdown
- Skip rest to move faster
- Complete or quit workout

### 5. View History
- After completing a workout, go to **History** tab
- See your workout log with duration
- Click to view details

## Install on iPhone

### Method 1: Via ngrok (Recommended)
1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 8000`
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
4. Open that URL in Safari on your iPhone
5. Tap Share → Add to Home Screen

### Method 2: Via Local Network
1. Find your computer's IP (Mac: System Prefs → Network)
2. On iPhone Safari, visit: `http://YOUR_IP:8000`
3. Tap Share → Add to Home Screen

## Verify Installation

After adding to home screen:
- ✅ App icon appears on home screen
- ✅ Opens fullscreen (no Safari UI)
- ✅ Works offline after initial load
- ✅ Data persists when you close and reopen

## Common Issues

**"Failed to load"**
- Make sure server is running
- Check you're using http:// not file://

**Icons don't show**
- Run icon-generator.html and download icons
- Place in assets/icons/ folder
- Refresh page with Cmd+Shift+R

**Timer doesn't sound**
- Check device is not on silent
- Try tapping screen to allow audio

**Data disappeared**
- Don't clear browser data
- Bookmark the exact URL you use

## Next Steps

1. **Customize exercises**: Edit descriptions, add video URLs
2. **Create routines**: Build routines for different days
3. **Schedule workouts**: Plan your week in Calendar
4. **Track progress**: Complete workouts and view history

## Need Help?

Check the full README.md for detailed documentation.

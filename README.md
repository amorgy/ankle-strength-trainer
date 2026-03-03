# Ankle Strength Trainer PWA

A Progressive Web App for tracking and completing ankle strengthening exercises.

## Features

- ✅ Pre-loaded with 11 ankle strengthening exercises
- ✅ Create custom workout routines
- ✅ Schedule workouts on a calendar
- ✅ Active workout tracking with 30-second rest timer
- ✅ Workout history and statistics
- ✅ Works offline (after initial load)
- ✅ Installable on iPhone home screen

## Getting Started

### 1. Serve the App

The app needs to be served over HTTP/HTTPS. You can use any local server:

**Option A: Using Python**
```bash
cd strength-app
python3 -m http.server 8000
```

**Option B: Using Node.js (if installed)**
```bash
cd strength-app
npx serve
```

**Option C: Using PHP**
```bash
cd strength-app
php -S localhost:8000
```

### 2. Access on Your Computer

Open your browser and go to:
- `http://localhost:8000`

### 3. Test on iPhone

**Via Local Network:**
1. Make sure your iPhone and computer are on the same WiFi
2. Find your computer's IP address:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in Command Prompt
   - Linux: `ip addr`
3. On iPhone Safari, visit: `http://YOUR_IP_ADDRESS:8000`

**Via ngrok (recommended for testing):**
```bash
# Install ngrok from ngrok.com
ngrok http 8000
```
Then visit the HTTPS URL provided on your iPhone.

### 4. Install on iPhone

1. Open the app in Safari on your iPhone
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on your home screen

## Creating App Icons

The app needs two icon files in `assets/icons/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

**Quick way to create icons:**

1. Use an online tool like:
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

2. Or use an emoji/simple design:
   - Open any image editor
   - Create 512x512 image with blue background
   - Add 💪 emoji or text "AS"
   - Save as `icon-512.png`
   - Resize to 192x192 and save as `icon-192.png`

3. Place both files in `strength-app/assets/icons/`

## How to Use

### First Time Setup

1. **Browse Exercises** - The app comes pre-loaded with 11 ankle strengthening exercises
2. **Create a Routine** - Go to Routines tab and create your first workout routine by selecting exercises
3. **Schedule Workouts** - Use the Calendar tab to assign routines to specific days
4. **Start Working Out** - From Dashboard or Routines, start an active workout

### During a Workout

1. Read the exercise description
2. Complete your set
3. Tap "Set Complete" to start the 30-second rest timer
4. When timer ends, do your next set
5. Continue until all exercises are done
6. View your completion stats and duration

### Settings

- Tap the **☰** menu button (top right) to access settings
- Adjust default rest timer (default: 30 seconds)
- Reset all data if needed

## Data Storage

- All data is stored locally in your browser's LocalStorage
- No internet connection required after initial load
- Data persists across sessions
- To backup data: settings menu → export (feature can be added)

## Troubleshooting

**App won't load:**
- Make sure you're serving over HTTP (not just opening index.html directly)
- Check browser console for errors

**Can't install on iPhone:**
- Must use Safari browser (not Chrome or Firefox)
- Make sure you're accessing via HTTP/HTTPS (not file://)
- iOS 11.3 or later required for PWA support

**Timer not working:**
- Make sure you've given browser permission for notifications/sound
- Check device is not in silent mode

**Data disappeared:**
- Don't clear browser data/cache
- LocalStorage is tied to the domain/URL - if URL changes, data won't transfer

## File Structure

```
strength-app/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── README.md              # This file
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── app.js              # Main app & dashboard
│   ├── data.js             # Data management & storage
│   ├── exercises.js        # Exercise library
│   ├── routines.js         # Routine builder
│   ├── calendar.js         # Workout calendar
│   ├── workout.js          # Active workout tracker
│   └── history.js          # Workout history
└── assets/
    └── icons/              # App icons (you need to create these)
```

## Customization

### Change Default Rest Time
Settings → Default Rest Timer

### Add Your Own Exercises
Exercises tab → + Add New Exercise

### Modify Pre-loaded Exercises
Exercises tab → Click exercise → Edit Exercise

## Future Enhancements (Not Yet Implemented)

- Push notifications for scheduled workouts (limited on iOS PWAs)
- Data export/import
- Exercise videos (add URLs to exercises)
- Progress photos
- Custom timer sounds
- Dark mode

## Technical Notes

- Built with vanilla JavaScript (no frameworks)
- Uses LocalStorage API for data persistence
- Uses Web Audio API for timer sound
- Uses Vibration API for timer alerts
- Service Worker for offline functionality
- Responsive design for mobile-first experience

## Browser Compatibility

- **iOS Safari**: Full support (recommended)
- **Chrome/Firefox iOS**: Limited (use Safari instead)
- **Desktop browsers**: Works but designed for mobile

## License

Free to use and modify for personal use.

# September 26 Offensive Operations - Poetry Collection

A beautiful, modern Progressive Web App for reading and managing poetry with advanced features like reading progress, text-to-speech, and social sharing.

🌐 **Live Demo:** [operationseptember.netlify.app](https://operationseptember.netlify.app)

## ✨ Features

### 📚 Core Poetry Features
- **Beautiful poem display** with expand/collapse functionality
- **Favorites system** with localStorage persistence
- **Reading progress tracking** with visual progress bars
- **5-star rating system** for poems
- **Advanced search and filtering** by title, author, content
- **Reading time estimates** based on word count
- **Status indicators** (new, reading, read)

### 🎨 User Experience
- **Dark/Light theme toggle** with smooth transitions
- **Responsive design** optimized for all devices
- **Smooth animations** and glassmorphism effects
- **Professional modal system** (no browser alerts)
- **Touch-friendly interface** for mobile devices

### 🔊 Media Features
- **Text-to-speech** with play/pause controls
- **Share poems** via native sharing API
- **Generate quote images** with custom canvas graphics
- **PDF export** functionality for collections

### 📱 Progressive Web App
- **Installable** on mobile and desktop devices
- 📶 **Offline Support**: Works without internet connection
- 🔄 **Background Sync**: Syncs data when back online
- 🔔 **Push Notifications**: Ready for future notification features
- ⚡ **Fast Loading**: Cached resources for instant loading
- 🎯 **App Shortcuts**: Quick access to favorites and random poems
- 📱 **Native Feel**: Runs like a native app when installed

## Getting Started

### Method 1: Simple File Server
1. Open a terminal in the project directory
2. If you have Python installed:
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -m SimpleHTTPServer 3000
   ```
3. Open `http://localhost:3000` in your browser

### Method 2: Node.js Server
1. Install Node.js if you haven't already
2. Run the included server:
   ```bash
   node server.js
   ```
3. Open `http://localhost:3000` in your browser

### Method 3: NPM Scripts
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   # or
   npm run dev
   ```

### Method 4: HTTPS (Recommended for full PWA testing)
For full PWA functionality (especially on mobile), HTTPS is required:

1. Using http-server with SSL:
   ```bash
   npm run https
   ```

2. Using ngrok (recommended):
   ```bash
   # Install ngrok globally
   npm install -g ngrok
   
   # Start your local server first
   npm start
   
   # In another terminal, expose it via HTTPS
   ngrok http 3000
   ```

## PWA Installation

### Desktop (Chrome, Edge, Firefox)
1. Open the app in your browser
2. Look for the "Install App" button in the header
3. Or click the install icon in the address bar
4. Follow the browser prompts

### Mobile (iOS Safari, Android Chrome)
1. Open the app in your mobile browser
2. **iOS**: Tap the share button → "Add to Home Screen"
3. **Android**: Tap the menu → "Add to Home Screen" or look for the install prompt

## PWA Features Usage

### Offline Mode
- The app automatically caches all content for offline use
- When offline, you'll see a red "Offline" indicator
- All your favorites, ratings, and reading progress work offline
- Changes sync automatically when you're back online

### App Shortcuts (when installed)
- **Favorites**: Direct access to your favorite poems
- **Random**: Jump to a random poem

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Focus search bar
- `Ctrl/Cmd + F`: Toggle favorites filter
- `Ctrl/Cmd + T`: Toggle theme
- `Escape`: Close expanded poems

## Customization

### Adding Your Own Poems
Edit `poems.js` and replace the placeholder poems with your content:

```javascript
const poemsData = [
    {
        id: 1,
        title: "Your Poem Title",
        author: "Author Name",
        stanzas: [
            "First stanza...",
            "Second stanza...",
            // Add more stanzas
        ]
    },
    // Add more poems
];
```

### Customizing App Appearance
- Edit `main.css` to change colors, fonts, and styling
- Update `manifest.json` to change app name, colors, and metadata
- Replace icons in the `icons/` folder (use `generate-icons.html` as a helper)

### Customizing PWA Behavior
- Edit `sw.js` to modify caching strategies
- Update `manifest.json` for different display modes or orientations

## Icon Generation

Use the included `generate-icons.html` file to create icons:

1. Open `generate-icons.html` in your browser
2. Click "Generate All Icons"
3. Download the generated icons
4. Place them in the `icons/` folder

## File Structure

```
poetry-pwa/
├── index.html          # Main HTML file
├── main.css           # Styles and PWA-specific CSS
├── logic.js           # Main application logic
├── poems.js           # Poem data
├── sw.js              # Service Worker for PWA functionality
├── manifest.json      # Web App Manifest
├── package.json       # NPM dependencies and scripts
├── server.js          # Simple development server
├── generate-icons.html # Icon generation utility
├── icons/             # App icons (generate using the utility)
├── screenshots/       # App screenshots (optional)
└── README.md          # This file
```

## Browser Support

### PWA Features
- **Chrome/Chromium**: Full support
- **Edge**: Full support
- **Firefox**: Partial support (no install prompt)
- **Safari**: Partial support (manual install only)

### Core App Features
- All modern browsers support the core functionality
- Graceful degradation for older browsers

## Development Notes

### Service Worker Updates
- The app automatically checks for updates
- Users get a notification when updates are available
- Updates require a page refresh to activate

### Local Storage
- Favorites, ratings, and reading progress are stored locally
- Data persists between sessions and app updates
- No server required for basic functionality

### Future Enhancements
- Push notifications for new poems
- User accounts and cloud sync
- Social sharing features
- Reading analytics dashboard

## Troubleshooting

### PWA Not Installing
- Ensure you're using HTTPS (required for PWA)
- Check browser console for manifest errors
- Verify all required icons are present

### Service Worker Issues
- Clear browser cache and reload
- Check browser developer tools → Application → Service Workers
- Ensure service worker is registered successfully

### Offline Mode Not Working
- Verify service worker is active
- Check Network tab in developer tools
- Ensure files are properly cached

## License

MIT License - feel free to use and modify for your own projects!

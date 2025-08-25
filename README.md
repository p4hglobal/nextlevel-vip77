# True North - VIP 77 Campaign Website for P4H Global

A responsive static website for the True North - VIP 77 fundraising campaign supporting P4H Global's educational mission in Haiti.

## 🌟 Features

- **Rotating Background Images**: P4H Global images from their website rotate every 60 seconds with smooth fade transitions
- **Video Carousel**: Display VIP 77 student testimonial videos with navigation controls
- **Interactive Donation Widget**: 
  - Default amount: $200
  - Adjustable with $50 increments
  - Direct integration with P4H Global's Kindful donation platform
- **Fully Static**: Works without any server - just open index.html in your browser
- **Responsive Design**: Mobile-first approach, works on all devices
- **P4H Global Branding**: Official logo and colors

## 📂 Project Structure

```
p4hglobal/
├── src/                        # Main website files (open index.html)
│   ├── index.html             # Main HTML file - OPEN THIS IN YOUR BROWSER
│   ├── styles/
│   │   └── main.css           # All styling
│   ├── js/
│   │   ├── main.js            # Main application
│   │   ├── background-rotator.js
│   │   ├── video-carousel.js
│   │   └── donation-widget.js
│   ├── images/                # Background images from P4H Global
│   │   ├── bg1.jpg
│   │   ├── bg2.jpg
│   │   ├── bg3.jpg
│   │   ├── bg4.jpg
│   │   └── p4h-logo.png
│   └── videos/                # Place video files here
│       └── Liam Helmer.mp4    # Example video
├── docs/                      # Documentation
└── tests/                     # Test suites
```

## 🚀 How to Use

### Option 1: Direct Browser Opening (Recommended)
1. Navigate to the `src` folder
2. Double-click on `index.html` to open it in your default browser
3. That's it! The website works completely offline

### Option 2: File Explorer
1. Open your file explorer/finder
2. Navigate to: `p4hglobal/src/`
3. Right-click on `index.html`
4. Select "Open with" → Your preferred browser

### Option 3: Browser File Menu
1. Open your web browser
2. Press `Ctrl+O` (Windows/Linux) or `Cmd+O` (Mac)
3. Navigate to `p4hglobal/src/index.html`
4. Click "Open"

## 📹 Adding Videos

1. Place your `.mp4` video files in the `src/videos/` directory
2. Name them descriptively (e.g., "Student Name.mp4")
3. Update the video list in `src/js/main.js` in the `loadVideos()` function:

```javascript
this.config.videos = [
    {
        title: "Student Name",
        description: "Description of the video",
        poster: "./images/bg1.jpg",  // Use one of the background images
        src: "./videos/Student Name.mp4"
    },
    // Add more videos here
];
```

## 🖼️ Updating Background Images

1. Place new images in `src/images/`
2. Update the list in `src/js/main.js`:

```javascript
backgroundImages: [
    './images/your-image.jpg',
    // Add more images here
]
```

## 💰 Donation Integration

The donation button automatically generates the correct URL for P4H Global's Kindful platform:
- Base URL: `https://p4hglobal.kindful.com/campaigns/1374266`
- Dynamic amount parameter based on user selection
- Default: $200, adjustable in $50 increments

## 🎨 Customization

### Colors
Edit `src/styles/main.css` to change colors:
- Background: Black (`#000000`)
- Primary text: White (`#ffffff`)
- Accent: P4H Red (`#dc2626`)

### Timing
Edit `src/js/main.js` to change rotation interval:
```javascript
60000 // Change this number (milliseconds)
```

## 📱 Browser Compatibility

Works on all modern browsers:
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Notes

- No server required - runs entirely in the browser
- No data collection or tracking
- Donation links go directly to P4H Global's secure platform

## 📧 Support

For questions about:
- **This website**: Contact the VIP 77 team
- **Donations**: Visit [P4H Global](https://p4hglobal.org)
- **Technical issues**: Check browser console for errors (F12)

## 🙏 Credits

- **P4H Global**: Educational mission in Haiti
- **True North - VIP 77**: Campaign organizers
- **Images**: Sourced from p4hglobal.org

---

*Supporting education in Haiti through P4H Global's transformative programs*
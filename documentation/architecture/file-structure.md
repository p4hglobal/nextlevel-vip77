# File Structure & Organization - True North VIP 77

## Directory Structure Overview

```
true-north-vip77/
│
├── index.html                     # Main entry point
├── manifest.json                  # Web app manifest
├── robots.txt                    # SEO robots file
├── sitemap.xml                   # SEO sitemap
│
├── src/                          # Source code directory
│   │
│   ├── styles/                   # CSS stylesheets
│   │   ├── main.css              # Core application styles
│   │   ├── components.css        # Component-specific styles
│   │   ├── responsive.css        # Responsive media queries
│   │   ├── utilities.css         # Utility classes
│   │   ├── animations.css        # CSS animations
│   │   └── variables.css         # CSS custom properties
│   │
│   ├── scripts/                  # JavaScript modules
│   │   ├── main.js               # Application initialization
│   │   ├── backgroundRotator.js  # Background rotation logic
│   │   ├── videoCarousel.js      # Video carousel component
│   │   ├── donationWidget.js     # Donation widget logic
│   │   ├── utils.js              # Shared utility functions
│   │   ├── accessibility.js      # A11y helper functions
│   │   └── analytics.js          # Analytics tracking
│   │
│   ├── components/               # HTML component templates
│   │   ├── header.html           # Site header
│   │   ├── hero.html             # Hero section
│   │   ├── carousel.html         # Video carousel
│   │   ├── donation.html         # Donation widget
│   │   └── footer.html           # Site footer
│   │
│   └── assets/                   # Static assets
│       │
│       ├── images/               # Image assets
│       │   ├── backgrounds/      # Rotating background images
│       │   │   ├── bg-1.webp
│       │   │   ├── bg-1-fallback.jpg
│       │   │   ├── bg-2.webp
│       │   │   ├── bg-2-fallback.jpg
│       │   │   └── ...
│       │   │
│       │   ├── icons/            # UI icons and graphics
│       │   │   ├── play.svg
│       │   │   ├── pause.svg
│       │   │   ├── arrow-left.svg
│       │   │   ├── arrow-right.svg
│       │   │   └── security.svg
│       │   │
│       │   ├── logos/            # Brand assets
│       │   │   ├── true-north-logo.svg
│       │   │   ├── vip77-logo.png
│       │   │   └── favicon.ico
│       │   │
│       │   └── thumbnails/       # Video thumbnails
│       │       ├── video-1-thumb.jpg
│       │       ├── video-2-thumb.jpg
│       │       └── ...
│       │
│       └── videos/               # Video assets
│           ├── intro-video.mp4
│           ├── intro-video.webm
│           ├── campaign-video-1.mp4
│           ├── campaign-video-1.webm
│           └── ...
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   │   ├── backgroundRotator.test.js
│   │   ├── videoCarousel.test.js
│   │   └── donationWidget.test.js
│   │
│   ├── integration/              # Integration tests
│   │   ├── page-interactions.test.js
│   │   └── accessibility.test.js
│   │
│   ├── fixtures/                 # Test data and fixtures
│   │   └── test-data.json
│   │
│   └── test-setup.js             # Test configuration
│
├── config/                       # Configuration files
│   ├── build.config.js           # Build configuration
│   ├── deploy.config.js          # Deployment settings
│   ├── eslint.config.js          # ESLint configuration
│   └── prettier.config.js        # Prettier configuration
│
└── docs/                         # Documentation
    └── architecture/             # Architecture documentation
        ├── system-architecture.md
        ├── component-specifications.md
        ├── file-structure.md
        ├── deployment-guide.md
        └── maintenance-guide.md
```

## File Descriptions

### Core Files

#### `index.html`
**Purpose**: Main HTML document and application entry point
**Contains**: 
- HTML structure for all components
- Meta tags for SEO and social sharing
- Critical CSS inlined
- Script loading configuration

#### `manifest.json`
**Purpose**: Web app manifest for PWA capabilities
**Contains**:
- App metadata
- Icon definitions
- Theme colors
- Display preferences

### Styles Directory (`src/styles/`)

#### `variables.css`
**Purpose**: CSS custom properties and design tokens
**Contains**:
```css
:root {
  /* Colors */
  --primary-color: #4CAF50;
  --background-color: #000000;
  --text-color: #ffffff;
  --secondary-text: #cccccc;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* Breakpoints */
  --breakpoint-mobile: 768px;
  --breakpoint-tablet: 1024px;
  --breakpoint-desktop: 1440px;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.6s ease;
}
```

#### `main.css`
**Purpose**: Core application styles and layout
**Contains**:
- CSS reset/normalize
- Base typography
- Layout grid system
- Global utilities

#### `components.css`
**Purpose**: Component-specific styling
**Contains**:
- Header/navigation styles
- Hero section styling
- Video carousel styles
- Donation widget styling
- Footer styles

#### `responsive.css`
**Purpose**: Responsive design media queries
**Contains**:
- Mobile-first breakpoints
- Component adaptations
- Typography scaling
- Layout adjustments

#### `utilities.css`
**Purpose**: Utility classes for common patterns
**Contains**:
```css
/* Layout utilities */
.flex { display: flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Spacing utilities */
.p-1 { padding: var(--spacing-sm); }
.m-1 { margin: var(--spacing-sm); }

/* Typography utilities */
.text-center { text-align: center; }
.font-bold { font-weight: bold; }

/* Accessibility utilities */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Scripts Directory (`src/scripts/`)

#### `main.js`
**Purpose**: Application initialization and coordination
**Responsibilities**:
- Initialize all components
- Handle global event coordination
- Manage application state
- Setup analytics tracking

```javascript
// Application initialization
class App {
  constructor() {
    this.components = new Map();
    this.init();
  }
  
  init() {
    // Initialize components
    this.initBackgroundRotator();
    this.initVideoCarousel();
    this.initDonationWidget();
    
    // Setup global event listeners
    this.setupGlobalEvents();
    
    // Initialize analytics
    this.initAnalytics();
  }
  
  initBackgroundRotator() {
    const container = document.querySelector('[data-background-rotator]');
    if (container) {
      this.components.set('backgroundRotator', 
        new BackgroundRotator(container, {
          interval: 60000,
          respectMotionPreference: true
        })
      );
    }
  }
  
  // Additional initialization methods...
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
```

#### `utils.js`
**Purpose**: Shared utility functions
**Contains**:
```javascript
// DOM utilities
export const $ = (selector, context = document) => 
  context.querySelector(selector);

export const $$ = (selector, context = document) => 
  [...context.querySelectorAll(selector)];

// Event utilities
export const on = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

// Animation utilities
export const requestAnimationFrame = 
  window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame ||
  (callback => setTimeout(callback, 16));

// Accessibility utilities
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Performance utilities
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
```

### Assets Directory Organization

#### Images Structure
**Background Images**:
- WebP format for modern browsers
- JPEG fallbacks for compatibility
- Multiple resolutions for responsive loading
- Optimized file sizes (target: <200KB per image)

**Naming Convention**:
```
backgrounds/
├── bg-1-mobile.webp     # Mobile optimized
├── bg-1-tablet.webp     # Tablet optimized  
├── bg-1-desktop.webp    # Desktop optimized
├── bg-1-mobile.jpg      # Mobile fallback
├── bg-1-tablet.jpg      # Tablet fallback
└── bg-1-desktop.jpg     # Desktop fallback
```

**Icons**: 
- SVG format for scalability
- Semantic naming
- Accessible with proper ARIA labels

#### Video Structure
**Format Strategy**:
- MP4 (H.264) for broad compatibility
- WebM (VP9) for better compression
- Multiple quality levels

**Naming Convention**:
```
videos/
├── intro-720p.mp4       # Standard quality
├── intro-1080p.mp4      # High quality
├── intro-720p.webm      # WebM standard
└── intro-1080p.webm     # WebM high quality
```

## Configuration Files

### `build.config.js`
**Purpose**: Build process configuration
```javascript
module.exports = {
  input: 'src/scripts/main.js',
  output: {
    file: 'dist/js/bundle.min.js',
    format: 'iife',
    name: 'TrueNorthApp'
  },
  plugins: [
    // Minification
    terser(),
    // CSS processing
    postcss({
      extract: 'dist/css/styles.min.css',
      minimize: true
    }),
    // Image optimization
    imageOptimization({
      webp: { quality: 80 },
      jpeg: { quality: 85 }
    })
  ]
};
```

### `deploy.config.js`
**Purpose**: Deployment configuration
```javascript
module.exports = {
  production: {
    host: 'truenorth-vip77.com',
    build: 'dist/',
    headers: {
      '/*.css': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '/*.js': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '/*.html': {
        'Cache-Control': 'public, max-age=3600'
      }
    },
    redirects: [
      { from: '/donate', to: '/#donation', status: 301 }
    ]
  }
};
```

## File Naming Conventions

### General Rules
1. **Lowercase with hyphens**: Use kebab-case for all files
2. **Descriptive names**: Files should clearly indicate their purpose
3. **Version suffixes**: Use semantic versioning for major updates
4. **Extension consistency**: Match file extensions to content type

### Specific Patterns

**CSS Files**:
- `component-name.css` for individual components
- `utility-type.css` for utility collections
- `responsive.css` for media queries

**JavaScript Files**:
- `ComponentName.js` for classes (PascalCase)
- `utility-functions.js` for utilities (kebab-case)
- `main.js` for entry points

**Image Files**:
- `purpose-variant-size.format`
- Example: `hero-background-desktop.webp`

**Video Files**:
- `title-quality.format`
- Example: `campaign-intro-1080p.mp4`

## Asset Optimization Guidelines

### Images
1. **WebP Priority**: Use WebP with JPEG fallbacks
2. **Responsive Sizing**: Multiple resolutions for different screens
3. **Compression**: Balance quality vs. file size
4. **Alt Text**: Always provide meaningful descriptions

### Videos
1. **Format Variety**: MP4 and WebM for broad support
2. **Quality Levels**: Multiple bitrates for different connections
3. **Poster Images**: Attractive thumbnails for all videos
4. **Captions**: Include subtitle tracks for accessibility

### Code Assets
1. **Minification**: All CSS and JS minified for production
2. **Tree Shaking**: Remove unused code
3. **Critical Path**: Inline critical CSS
4. **Lazy Loading**: Non-critical resources loaded async

---

**Document Version**: 1.0  
**Last Updated**: August 25, 2025  
**Structure Architect**: System Architecture Agent
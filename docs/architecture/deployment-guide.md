# Deployment Guide - True North VIP 77

## Overview

This guide outlines the deployment strategy for the True North - VIP 77 campaign website, focusing on static hosting with optimal performance and security.

## Deployment Architecture

### Static Site Hosting Strategy

```
┌────────────────────────────────────┐
│             CDN Edge Locations           │
│         (Global Distribution)            │
├────────────────────────────────────┤
│                                        │
│          Origin Server                 │
│      (Static File Hosting)             │
│                                        │
├────────────────────────────────────┤
│                                        │
│        Build Pipeline                 │
│    (CI/CD Automation)                 │
│                                        │
└────────────────────────────────────┘
```

## Recommended Hosting Platforms

### Primary Option: Netlify
**Benefits**:
- Automatic deployments from Git
- Built-in CDN with global edge locations
- Form handling for donation processing
- Custom headers and redirects
- Branch previews for testing
- Analytics and performance monitoring

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Encoding = "br, gzip"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Encoding = "br, gzip"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https:;"

[[headers]]
  for = "/*.webp"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.jpg"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.mp4"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/donate"
  to = "/#donation"
  status = 301

[[redirects]]
  from = "/videos"
  to = "/#video-carousel"
  status = 301

[dev]
  command = "npm run dev"
  port = 3000
  targetPort = 8000
```

### Secondary Option: Vercel
**Benefits**:
- Excellent performance optimization
- Automatic image optimization
- Edge functions for dynamic content
- Analytics and Web Vitals monitoring

**Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "headers": [
    {
      "source": "/(.*\\.(css|js|webp|jpg|mp4))$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.html?)$",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/donate",
      "destination": "/#donation",
      "permanent": true
    }
  ]
}
```

### Alternative Option: GitHub Pages
**Benefits**:
- Free hosting for public repositories
- Direct integration with GitHub
- Custom domain support
- SSL certificates included

**Configuration** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: truenorth-vip77.com
```

## Build Process

### Development Workflow

1. **Local Development**:
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   
   # Open browser to http://localhost:3000
   ```

2. **Testing**:
   ```bash
   # Run unit tests
   npm run test
   
   # Run accessibility tests
   npm run test:a11y
   
   # Run performance tests
   npm run test:perf
   ```

3. **Build for Production**:
   ```bash
   # Create optimized build
   npm run build
   
   # Preview production build
   npm run preview
   ```

### Build Configuration (`package.json`)

```json
{
  "name": "true-north-vip77",
  "version": "1.0.0",
  "description": "True North VIP 77 Campaign Website",
  "scripts": {
    "dev": "vite",
    "build": "vite build && npm run optimize",
    "preview": "vite preview",
    "test": "jest",
    "test:a11y": "pa11y http://localhost:3000",
    "test:perf": "lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html",
    "optimize": "npm run optimize:images && npm run optimize:videos",
    "optimize:images": "imagemin 'src/assets/images/**/*.{jpg,png}' --out-dir=dist/assets/images --plugin=webp --plugin=mozjpeg",
    "optimize:videos": "ffmpeg -i src/assets/videos/*.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k dist/assets/videos/",
    "lint": "eslint src --ext .js",
    "format": "prettier --write src/**/*.{js,css,html}"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "jest": "^29.0.0",
    "pa11y": "^6.2.3",
    "lighthouse": "^10.0.0",
    "imagemin": "^8.0.1",
    "imagemin-webp": "^7.0.0",
    "imagemin-mozjpeg": "^10.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0"
  }
}
```

## Performance Optimization

### Asset Optimization Pipeline

1. **Image Optimization**:
   ```javascript
   // build/optimize-images.js
   const imagemin = require('imagemin');
   const imageminWebp = require('imagemin-webp');
   const imageminMozjpeg = require('imagemin-mozjpeg');
   
   async function optimizeImages() {
     // Convert to WebP
     await imagemin(['src/assets/images/*.{jpg,png}'], {
       destination: 'dist/assets/images',
       plugins: [
         imageminWebp({ quality: 80 })
       ]
     });
     
     // Optimize JPEG fallbacks
     await imagemin(['src/assets/images/*.jpg'], {
       destination: 'dist/assets/images',
       plugins: [
         imageminMozjpeg({ quality: 85 })
       ]
     });
   }
   
   optimizeImages();
   ```

2. **CSS Optimization**:
   ```javascript
   // build/optimize-css.js
   const postcss = require('postcss');
   const autoprefixer = require('autoprefixer');
   const cssnano = require('cssnano');
   
   const plugins = [
     autoprefixer,
     cssnano({
       preset: ['default', {
         discardComments: { removeAll: true },
         normalizeWhitespace: true
       }]
     })
   ];
   ```

3. **JavaScript Optimization**:
   ```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['utils'],
             components: [
               'backgroundRotator',
               'videoCarousel', 
               'donationWidget'
             ]
           }
         }
       },
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true,
           drop_debugger: true
         }
       }
     }
   };
   ```

### Caching Strategy

1. **Static Assets**: 1 year cache with immutable flag
2. **HTML Files**: 1 hour cache for quick updates
3. **API Responses**: No cache (if applicable)
4. **Service Worker**: Cache-first for assets, network-first for HTML

### Content Delivery Network (CDN)

**Cache Rules**:
```
# Static assets (CSS, JS, images, videos)
Cache-Control: public, max-age=31536000, immutable

# HTML files
Cache-Control: public, max-age=3600

# Dynamic content
Cache-Control: no-cache
```

**Geographic Distribution**:
- North America: Primary edge locations
- Europe: Secondary distribution
- Asia-Pacific: Tertiary coverage

## Security Configuration

### Content Security Policy (CSP)

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  media-src 'self' https:;
  connect-src 'self' https://api.stripe.com https://www.google-analytics.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src https://js.stripe.com;
  report-uri /csp-report;
```

### Security Headers

```
# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Control referrer information
Referrer-Policy: strict-origin-when-cross-origin

# Enable XSS protection
X-XSS-Protection: 1; mode=block

# Force HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### SSL/TLS Configuration

- **Certificate**: Let's Encrypt or platform-provided SSL
- **Protocol**: TLS 1.2 minimum, TLS 1.3 preferred
- **Ciphers**: Modern cipher suites only
- **HSTS**: Enabled with preload

## Domain Configuration

### DNS Settings

```
; Primary domain
truenorth-vip77.com.     IN  A      192.0.2.1
www.truenorth-vip77.com. IN  CNAME  truenorth-vip77.com.

; CDN aliases
cdn.truenorth-vip77.com. IN  CNAME  cdn-provider.net.

; Email (if needed)
mx.truenorth-vip77.com.  IN  MX     10 mail.provider.com.
```

### Subdomain Strategy

- **www**: Redirect to apex domain
- **cdn**: Static asset delivery
- **api**: Future API endpoint (if needed)
- **staging**: Development/testing environment

## Monitoring and Analytics

### Performance Monitoring

1. **Core Web Vitals**:
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

2. **Custom Metrics**:
   - Background rotation performance
   - Video carousel load times
   - Donation widget interaction rates

3. **Error Tracking**:
   ```javascript
   // Error reporting
   window.addEventListener('error', (event) => {
     // Send error to monitoring service
     fetch('/api/errors', {
       method: 'POST',
       body: JSON.stringify({
         message: event.message,
         filename: event.filename,
         lineno: event.lineno,
         colno: event.colno,
         userAgent: navigator.userAgent,
         url: window.location.href,
         timestamp: Date.now()
       })
     });
   });
   ```

### Analytics Implementation

```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  // Enhanced measurement
  enhanced_measurement_scroll: true,
  enhanced_measurement_outbound_links: true,
  enhanced_measurement_video_engagement: true,
  
  // Custom dimensions
  custom_map: {
    'dimension1': 'donation_amount',
    'dimension2': 'video_engagement',
    'dimension3': 'background_preference'
  }
});

// Custom event tracking
function trackDonationAttempt(amount, type) {
  gtag('event', 'donation_attempt', {
    'event_category': 'engagement',
    'event_label': type,
    'value': amount
  });
}

function trackVideoPlay(videoId, title) {
  gtag('event', 'video_play', {
    'event_category': 'video',
    'event_label': title,
    'video_id': videoId
  });
}
```

## Backup and Recovery

### Source Code Backup
- **Git Repository**: Primary source control
- **Multiple Remotes**: GitHub, GitLab, Bitbucket
- **Branch Protection**: Main branch requires PR review

### Asset Backup
- **Cloud Storage**: S3, Google Cloud Storage, or equivalent
- **Version Control**: Git LFS for large assets
- **Geographic Distribution**: Multiple regions

### Deployment Rollback
```bash
# Quick rollback to previous deployment
npm run deploy:rollback

# Or manual rollback
git revert HEAD
git push origin main
```

## Environment-Specific Configurations

### Development
```javascript
// config/development.js
module.exports = {
  apiUrl: 'http://localhost:3001',
  analytics: false,
  debug: true,
  minify: false,
  backgroundRotation: {
    interval: 10000 // Faster for testing
  }
};
```

### Staging
```javascript
// config/staging.js
module.exports = {
  apiUrl: 'https://staging-api.truenorth-vip77.com',
  analytics: true,
  debug: false,
  minify: true,
  backgroundRotation: {
    interval: 60000
  }
};
```

### Production
```javascript
// config/production.js
module.exports = {
  apiUrl: 'https://api.truenorth-vip77.com',
  analytics: true,
  debug: false,
  minify: true,
  backgroundRotation: {
    interval: 60000
  }
};
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass (unit, integration, accessibility)
- [ ] Performance audit completed (Lighthouse score > 90)
- [ ] Security scan completed
- [ ] Assets optimized (images, videos, code)
- [ ] DNS configuration verified
- [ ] SSL certificate configured
- [ ] Analytics tracking tested
- [ ] Error monitoring configured

### Post-Deployment
- [ ] Site loads correctly across all breakpoints
- [ ] All interactive features functional
- [ ] Background rotation working
- [ ] Video carousel operational
- [ ] Donation widget responsive
- [ ] Forms submitting correctly
- [ ] Analytics recording events
- [ ] Performance metrics within targets
- [ ] Security headers active
- [ ] CDN cache rules applied

### Ongoing Maintenance
- [ ] Weekly performance monitoring review
- [ ] Monthly security updates
- [ ] Quarterly analytics analysis
- [ ] Semi-annual full site audit
- [ ] Annual platform/dependency updates

---

**Guide Version**: 1.0  
**Last Updated**: August 25, 2025  
**Deployment Architect**: System Architecture Agent
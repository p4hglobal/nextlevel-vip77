# True North - VIP 77 Campaign Website Architecture

## Executive Summary

This document outlines the system architecture for the True North - VIP 77 campaign website, designed as a high-performance, accessible, responsive static site with dynamic interactive features.

## Architecture Overview

### Design Principles
- **Mobile-First**: Responsive design prioritizing mobile experience
- **Performance-Focused**: Optimized loading and rendering
- **Accessibility-Compliant**: WCAG 2.1 AA standards
- **Separation of Concerns**: Clean modular architecture
- **Progressive Enhancement**: Core functionality without JavaScript

### Technical Stack
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript ES6+
- **Build Tools**: None (static deployment)
- **Hosting**: Static hosting (Netlify/Vercel/GitHub Pages)
- **Performance**: Lazy loading, image optimization, minification

## System Components

### 1. Layout Architecture

#### Core Layout Structure
```
┌─────────────────────────────────────┐
│            Header/Navigation        │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│    (Rotating Background)            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       Video Carousel                │
│    (Navigation Controls)            │
│                                     │
├─────────────────────────────────────┤
│                                     │
│       Donation Widget               │
│   (Editable Amount: $200)           │
│                                     │
├─────────────────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

#### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### 2. Component Architecture

#### A. Background Rotation System
**Purpose**: Cycle through campaign images every 60 seconds with smooth fade transitions

**Technical Specifications**:
- Image preloading for smooth transitions
- CSS transitions (opacity-based fading)
- JavaScript timer management
- Pause on user interaction
- Accessibility: respects `prefers-reduced-motion`

**Performance Considerations**:
- WebP format with JPEG fallback
- Responsive image sizing
- Lazy loading for non-active images
- Memory management (unload inactive images)

#### B. Video Carousel System
**Purpose**: Interactive video gallery with navigation controls

**Features**:
- Horizontal scrolling/sliding mechanism
- Previous/Next navigation buttons
- Dot indicators for direct access
- Touch/swipe gesture support
- Keyboard navigation (arrow keys, tab)
- Auto-pause on scroll

**Accessibility Features**:
- ARIA labels and roles
- Focus management
- Screen reader announcements
- Keyboard navigation support

#### C. Donation Widget
**Purpose**: Interactive donation amount selector with preset increments

**Features**:
- Default amount: $200
- Increment/decrement by $50
- Custom amount input option
- Visual feedback on selection
- Form validation
- Multiple payment method integration ready

**User Experience**:
- Clear visual hierarchy
- Immediate feedback on amount changes
- Error state handling
- Success confirmation

### 3. File Structure

```
true-north-vip77/
├── index.html                 # Main HTML document
├── src/
│   ├── styles/
│   │   ├── main.css          # Core styles and layout
│   │   ├── components.css    # Component-specific styles
│   │   ├── responsive.css    # Media queries
│   │   └── utilities.css     # Utility classes
│   ├── scripts/
│   │   ├── main.js          # Application initialization
│   │   ├── backgroundRotator.js  # Background rotation logic
│   │   ├── videoCarousel.js      # Carousel functionality
│   │   ├── donationWidget.js     # Donation amount handling
│   │   └── utils.js             # Shared utilities
│   ├── components/
│   │   ├── header.html      # Header component template
│   │   ├── hero.html        # Hero section template
│   │   ├── carousel.html    # Video carousel template
│   │   ├── donation.html    # Donation widget template
│   │   └── footer.html      # Footer template
│   └── assets/
│       ├── images/
│       │   ├── backgrounds/ # Rotating background images
│       │   ├── icons/      # UI icons and graphics
│       │   └── logos/      # Brand assets
│       └── videos/         # Carousel video files
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── config/
│   ├── build.config.js     # Build configuration
│   └── deploy.config.js    # Deployment settings
└── docs/
    └── architecture/       # Architecture documentation
```

## Module Specifications

### 1. Background Rotation Module (`backgroundRotator.js`)

**Interface**:
```javascript
class BackgroundRotator {
  constructor(options = {})
  start()
  pause()
  resume()
  next()
  previous()
  setInterval(milliseconds)
  destroy()
}
```

**Configuration Options**:
- `interval`: Rotation interval (default: 60000ms)
- `fadeTransition`: Transition duration (default: 1000ms)
- `images`: Array of image objects
- `respectMotionPreference`: Honor reduced-motion (default: true)
- `pauseOnHover`: Pause rotation on hover (default: true)

### 2. Video Carousel Module (`videoCarousel.js`)

**Interface**:
```javascript
class VideoCarousel {
  constructor(container, options = {})
  next()
  previous()
  goTo(index)
  play(index)
  pause()
  destroy()
}
```

**Features**:
- Touch/swipe gesture support
- Keyboard navigation
- Responsive behavior
- Lazy loading
- Accessibility compliance

### 3. Donation Widget Module (`donationWidget.js`)

**Interface**:
```javascript
class DonationWidget {
  constructor(container, options = {})
  setAmount(amount)
  increment()
  decrement()
  validate()
  reset()
  getAmount()
}
```

**Configuration**:
- `defaultAmount`: Starting amount (default: 200)
- `increment`: Step amount (default: 50)
- `minAmount`: Minimum donation (default: 50)
- `maxAmount`: Maximum donation (default: 10000)
- `currency`: Currency symbol (default: '$')

## Performance Strategy

### Loading Performance
1. **Critical Path Optimization**
   - Inline critical CSS
   - Async non-critical resources
   - Preload key images

2. **Image Optimization**
   - WebP format with fallbacks
   - Responsive image sizes
   - Lazy loading implementation

3. **JavaScript Optimization**
   - Module bundling for production
   - Tree shaking unused code
   - Async script loading

### Runtime Performance
1. **Memory Management**
   - Efficient DOM manipulation
   - Event listener cleanup
   - Image cache management

2. **Animation Performance**
   - CSS transforms over layout properties
   - RequestAnimationFrame for smooth animations
   - GPU acceleration where appropriate

## Accessibility Compliance

### WCAG 2.1 AA Requirements
1. **Perceivable**
   - Alt text for all images
   - Sufficient color contrast (4.5:1)
   - Scalable text up to 200%
   - Reduced motion support

2. **Operable**
   - Keyboard navigation support
   - Focus indicators
   - No seizure-inducing content
   - Reasonable time limits

3. **Understandable**
   - Clear navigation structure
   - Consistent interface patterns
   - Form validation messages
   - Error handling

4. **Robust**
   - Valid HTML markup
   - ARIA labels and roles
   - Screen reader compatibility
   - Cross-browser support

## Security Considerations

### Content Security Policy
- Restrict inline scripts
- Allow specific image/video sources
- Prevent XSS attacks

### Data Protection
- No sensitive data in client-side code
- Secure donation processing
- Privacy-compliant analytics

## Deployment Architecture

### Static Hosting Strategy
1. **CDN Distribution**
   - Global edge locations
   - Asset caching strategies
   - Compression (Gzip/Brotli)

2. **Build Process**
   - Asset minification
   - Image optimization
   - Cache busting

3. **Monitoring**
   - Performance metrics
   - Error tracking
   - User analytics

## Technical Debt Prevention

### Code Quality
- ESLint configuration
- Prettier code formatting
- CSS methodology (BEM)
- Documentation standards

### Testing Strategy
- Unit tests for all modules
- Integration testing
- Cross-browser testing
- Accessibility testing

### Maintenance
- Regular dependency updates
- Performance monitoring
- Analytics review
- User feedback integration

---

**Architecture Version**: 1.0  
**Last Updated**: August 25, 2025  
**Architect**: System Architecture Agent  
**Review Status**: Initial Design
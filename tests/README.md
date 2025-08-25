# P4H Global Campaign Website Test Suite

Comprehensive testing framework for the True North VIP 77 campaign website supporting P4H Global.

## Overview

This test suite provides automated and manual testing procedures for:
- **Responsive Design**: Cross-device compatibility testing
- **Functionality**: Core features and user interactions  
- **Accessibility**: WCAG 2.1 compliance and assistive technology
- **Performance**: Load times, animations, and optimization

## Quick Start

### Installation
```bash
cd tests
npm install
```

### Run All Tests
```bash
npm run test:all
```

### Generate Reports
```bash
npm run report
```

## Test Categories

### 🎨 Responsive Design Tests
**Location**: `/tests/automated/responsive.test.js`

Tests website adaptation across device breakpoints:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px, 2560px

**Manual Procedures**: `/tests/manual/responsive-testing-checklist.md`

### ⚙️ Functionality Tests  
**Location**: `/tests/automated/functionality.test.js`

Tests core website features:
- Background image rotation (60-second intervals)
- Video carousel navigation with arrow controls
- Donation amount editor ($50 increments)
- Kindful URL generation with correct parameters

**Manual Procedures**: `/tests/manual/functionality-testing-procedures.md`

### ♿ Accessibility Tests
**Location**: `/tests/automated/accessibility.test.js`

Tests inclusive design and compliance:
- ARIA labels and semantic HTML
- Keyboard navigation compatibility  
- Screen reader support
- WCAG 2.1 Level AA compliance

**Manual Procedures**: `/tests/manual/accessibility-testing-guide.md`

### ⚡ Performance Tests
**Location**: `/tests/automated/performance.test.js`

Tests speed and optimization:
- Page load times and Core Web Vitals
- Animation smoothness and frame rates
- Resource optimization and caching
- Network condition resilience

## Campaign Requirements

### Background Image Rotation
- **Source**: Images from p4hglobal.org
- **Interval**: 60 seconds per rotation
- **Transition**: Fade effect between images
- **Responsive**: Proper scaling across all devices

### Video Carousel
- **Location**: `/videos/` directory  
- **Current**: `Liam Helmer.mp4`
- **Navigation**: Left/right arrows for browsing
- **Labels**: Person names extracted from filenames
- **Responsive**: Touch-friendly controls on mobile

### Donation Integration
- **Default Amount**: $200
- **Increment**: $50 steps (up/down arrows)
- **Editable**: Click-to-edit amount field
- **URL Format**: `https://p4hglobal.kindful.com/campaigns/1374266?amount=[AMOUNT]&recurring=landing_recurring&frequency=`

### Content Integration  
- **P4H Global Logo**: Prominent display
- **Campaign Info**: True North VIP 77 attribution
- **Messaging**: Haiti education transformation focus

## Test Execution

### Automated Tests

#### All Test Suites
```bash
npm run test:all
```

#### Individual Suites
```bash
npm run test:responsive      # Responsive design tests
npm run test:functionality   # Feature functionality tests  
npm run test:accessibility   # Accessibility compliance tests
npm run test:performance     # Performance and optimization tests
```

#### End-to-End Tests
```bash  
npm run test:e2e            # Playwright browser tests
```

#### Accessibility Audit
```bash
npm run test:accessibility  # Axe-core accessibility scan
```

### Manual Testing

#### Device Testing Matrix
Follow procedures in `/tests/manual/responsive-testing-checklist.md`:
- Physical device testing on iOS/Android
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Network condition testing (3G, 4G, WiFi)

#### Functionality Validation  
Use `/tests/manual/functionality-testing-procedures.md`:
- Background rotation timing and transitions
- Video carousel navigation and playback
- Donation amount editing and URL generation  
- Cross-browser compatibility verification

#### Accessibility Audit
Follow `/tests/manual/accessibility-testing-guide.md`:
- Screen reader testing (NVDA, JAWS, VoiceOver, TalkBack)
- Keyboard navigation validation
- Color contrast measurement
- Touch target size verification

## Performance Targets

### Core Web Vitals
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds  
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100 milliseconds

### Animation Performance
- **Frame Rate**: > 30 FPS sustained
- **Background Transitions**: Smooth fade effects
- **Carousel Navigation**: No jank or stuttering

## Accessibility Requirements

### WCAG 2.1 Compliance
- **Target Level**: AA compliance
- **Color Contrast**: 4.5:1 ratio minimum
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: 44x44px minimum size

### Assistive Technology Support
- Screen readers (NVDA, JAWS, VoiceOver, TalkBack)
- Voice control (Dragon, Apple Voice Control)
- Screen magnification (up to 400% zoom)
- Alternative input methods

## Browser and Device Support

### Desktop Browsers
- Chrome (latest, previous)
- Firefox (latest)
- Safari (macOS latest)
- Edge (latest)

### Mobile Browsers  
- Mobile Chrome (Android)
- Mobile Safari (iOS)
- Samsung Internet
- Firefox Mobile

### Device Categories
- **Mobile**: iPhone SE to iPhone 14 Pro Max
- **Tablet**: iPad to iPad Pro (portrait and landscape)
- **Desktop**: 1280px to 4K displays
- **Ultrawide**: 3440x1440 and similar

## Test Reports

### Automated Report Generation
```bash
npm run report              # Generate comprehensive HTML/JSON/MD reports
```

### Report Locations
- **HTML Report**: `/tests/reports/comprehensive-test-report.html`
- **JSON Data**: `/tests/reports/test-results.json`
- **Markdown**: `/tests/reports/TEST-REPORT.md`

### Continuous Integration
Reports are generated automatically and include:
- Test execution summaries
- Performance benchmarks
- Accessibility audit results  
- Cross-browser compatibility matrix
- Responsive design validation
- Detailed failure analysis

## Configuration

### Playwright Configuration
**File**: `/tests/playwright.config.js`
- Browser matrix (Chromium, Firefox, WebKit)
- Device simulation profiles
- Screenshot and video capture
- Network throttling options

### Jest Configuration
**File**: `/tests/package.json`
- Test environment setup (jsdom)
- Coverage reporting
- Custom matchers and utilities
- Mock configurations

### Test Utilities
**File**: `/tests/utils/test-setup.js`
- Custom Jest matchers
- Responsive design helpers
- Animation testing utilities
- Accessibility extensions

## Development Workflow

### Pre-Implementation
1. Review test requirements and procedures
2. Understand campaign functionality needs
3. Set up test environment and dependencies

### During Implementation  
1. Run automated tests continuously
2. Use manual checklists for feature validation
3. Monitor performance during development
4. Validate accessibility as features are built

### Pre-Deployment
1. Execute full automated test suite
2. Complete manual testing procedures  
3. Perform comprehensive accessibility audit
4. Validate performance against targets
5. Generate and review test reports

### Post-Deployment
1. Monitor real user performance data
2. Conduct user acceptance testing
3. Set up ongoing performance monitoring
4. Plan iterative improvements

## Troubleshooting

### Common Issues

#### Tests Not Running
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Browser Detection Issues
```bash
# Install browser binaries
npx playwright install
```

#### Accessibility False Positives
- Review axe-core configuration
- Check for dynamic content timing
- Validate ARIA implementation

#### Performance Inconsistencies
- Run tests multiple times for averages
- Check for background processes
- Validate network conditions

### Getting Help

1. **Check Documentation**: Review manual testing procedures
2. **Run Diagnostics**: Use `npm run test -- --verbose` for detailed output
3. **Isolate Issues**: Run individual test suites to narrow problems
4. **Review Logs**: Check browser console and test output
5. **Contact Team**: Reach out to development team with specific error details

## Contributing

### Adding New Tests
1. Follow existing test patterns and naming conventions
2. Add both automated and manual test procedures
3. Update documentation and checklists
4. Ensure cross-browser compatibility

### Updating Test Data
1. Modify test fixtures in `/tests/fixtures/`
2. Update expected results in test assertions
3. Regenerate reports to reflect changes

### Improving Coverage
1. Identify gaps in current test suite
2. Add edge cases and error conditions  
3. Enhance accessibility and performance testing
4. Expand device and browser matrix

---

**Test Suite Version**: 1.0.0  
**Last Updated**: Generated with comprehensive test framework  
**Maintained By**: P4H Global Campaign Development Team

For questions, issues, or contributions, please contact the development team.
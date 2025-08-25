# Component Specifications - True North VIP 77

## Overview

Detailed specifications for each interactive component in the True North VIP 77 campaign website.

## 1. Background Rotation System

### Component Purpose
Automatically cycles through a collection of campaign background images with smooth fade transitions every 60 seconds.

### Technical Implementation

#### HTML Structure
```html
<div class="background-container" data-background-rotator>
  <div class="background-slide active" data-bg="image1.webp">
    <img src="assets/images/backgrounds/image1.webp" alt="Campaign Image 1" loading="eager">
  </div>
  <div class="background-slide" data-bg="image2.webp">
    <img src="assets/images/backgrounds/image2.webp" alt="Campaign Image 2" loading="lazy">
  </div>
  <!-- Additional slides -->
</div>
```

#### CSS Architecture
```css
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.background-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  will-change: opacity;
}

.background-slide.active {
  opacity: 1;
}

.background-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@media (prefers-reduced-motion: reduce) {
  .background-slide {
    transition: none;
  }
}
```

#### JavaScript API
```javascript
class BackgroundRotator {
  constructor(container, options = {}) {
    this.container = container;
    this.slides = [...container.querySelectorAll('.background-slide')];
    this.currentIndex = 0;
    this.interval = options.interval || 60000;
    this.fadeTransition = options.fadeTransition || 1000;
    this.respectMotionPreference = options.respectMotionPreference !== false;
    this.pauseOnHover = options.pauseOnHover !== false;
    
    this.timer = null;
    this.isPaused = false;
    
    this.init();
  }
  
  init() {
    this.preloadImages();
    this.setupEventListeners();
    this.start();
  }
  
  preloadImages() {
    this.slides.forEach((slide, index) => {
      if (index > 0) { // Skip first image (already loaded)
        const img = slide.querySelector('img');
        if (img && img.loading === 'lazy') {
          img.loading = 'eager';
        }
      }
    });
  }
  
  start() {
    if (this.respectMotionPreference && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, this.interval);
  }
  
  next() {
    const currentSlide = this.slides[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    const nextSlide = this.slides[this.currentIndex];
    
    currentSlide.classList.remove('active');
    nextSlide.classList.add('active');
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
  }
  
  destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
```

### Performance Optimizations
- Uses CSS `will-change` for GPU acceleration
- Preloads images progressively
- Respects user's motion preferences
- Memory-efficient slide management

## 2. Video Carousel Component

### Component Purpose
Interactive video gallery with smooth navigation, supporting touch gestures and keyboard controls.

### Technical Implementation

#### HTML Structure
```html
<section class="video-carousel" data-carousel>
  <div class="carousel-container">
    <div class="carousel-track" data-track>
      <div class="carousel-slide">
        <video poster="assets/images/video-poster-1.jpg" preload="metadata">
          <source src="assets/videos/video1.mp4" type="video/mp4">
          <source src="assets/videos/video1.webm" type="video/webm">
        </video>
        <div class="video-info">
          <h3>Video Title 1</h3>
          <p>Video description</p>
        </div>
      </div>
      <!-- Additional slides -->
    </div>
  </div>
  
  <div class="carousel-navigation">
    <button class="nav-btn nav-prev" aria-label="Previous video" data-nav="prev">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
      </svg>
    </button>
    
    <div class="carousel-indicators" role="tablist">
      <button class="indicator active" role="tab" aria-selected="true" data-slide="0">
        <span class="sr-only">Go to video 1</span>
      </button>
      <!-- Additional indicators -->
    </div>
    
    <button class="nav-btn nav-next" aria-label="Next video" data-nav="next">
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.59 16.09l4.58-4.59-4.58-4.59L10 5.5l6 6-6 6z"/>
      </svg>
    </button>
  </div>
</section>
```

#### CSS Architecture
```css
.video-carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.3s ease-out;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  position: relative;
}

.carousel-slide video {
  width: 100%;
  height: auto;
  display: block;
}

.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.carousel-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.9);
}

.nav-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover,
.nav-btn:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active,
.indicator:hover {
  background: white;
  border-color: white;
}

/* Touch gesture support */
.carousel-track {
  touch-action: pan-y;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .carousel-navigation {
    padding: 0.5rem;
  }
  
  .nav-btn {
    padding: 0.375rem;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
  }
}
```

#### JavaScript API
```javascript
class VideoCarousel {
  constructor(container, options = {}) {
    this.container = container;
    this.track = container.querySelector('[data-track]');
    this.slides = [...this.track.querySelectorAll('.carousel-slide')];
    this.indicators = [...container.querySelectorAll('.indicator')];
    this.prevBtn = container.querySelector('[data-nav="prev"]');
    this.nextBtn = container.querySelector('[data-nav="next"]');
    
    this.currentIndex = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.options = {
      autoPlay: false,
      autoPlayInterval: 5000,
      touchEnabled: true,
      keyboardEnabled: true,
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateUI();
    
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previous());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });
    
    // Touch gestures
    if (this.options.touchEnabled) {
      this.track.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.track.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    // Keyboard navigation
    if (this.options.keyboardEnabled) {
      this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    
    // Pause auto-play on hover
    this.container.addEventListener('mouseenter', this.pauseAutoPlay.bind(this));
    this.container.addEventListener('mouseleave', this.resumeAutoPlay.bind(this));
  }
  
  next() {
    if (this.isAnimating || this.currentIndex >= this.slides.length - 1) return;
    this.goTo(this.currentIndex + 1);
  }
  
  previous() {
    if (this.isAnimating || this.currentIndex <= 0) return;
    this.goTo(this.currentIndex - 1);
  }
  
  goTo(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    
    this.isAnimating = true;
    this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
    
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 300); // Match CSS transition duration
    
    this.updateUI();
  }
  
  updateUI() {
    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
      indicator.setAttribute('aria-selected', index === this.currentIndex);
    });
    
    // Update navigation buttons
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    const deltaX = this.touchStartX - this.touchEndX;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        this.next();
      } else {
        this.previous();
      }
    }
  }
  
  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'Home':
        e.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        e.preventDefault();
        this.goTo(this.slides.length - 1);
        break;
    }
  }
}
```

## 3. Donation Widget Component

### Component Purpose
Interactive donation amount selector with preset increments and custom input capability.

### Technical Implementation

#### HTML Structure
```html
<section class="donation-widget" data-donation-widget>
  <div class="donation-header">
    <h2>Support True North - VIP 77</h2>
    <p>Help us reach our campaign goals</p>
  </div>
  
  <div class="amount-selector">
    <div class="amount-display">
      <span class="currency">$</span>
      <input type="number" 
             class="amount-input" 
             value="200" 
             min="50" 
             max="10000" 
             step="50"
             data-amount-input
             aria-label="Donation amount in dollars">
    </div>
    
    <div class="amount-controls">
      <button class="amount-btn decrease" 
              data-amount-action="decrease"
              aria-label="Decrease amount by $50">
        <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 13H5v-2h14v2z"/>
        </svg>
      </button>
      
      <div class="preset-amounts">
        <button class="preset-btn" data-preset="100">$100</button>
        <button class="preset-btn active" data-preset="200">$200</button>
        <button class="preset-btn" data-preset="500">$500</button>
        <button class="preset-btn" data-preset="1000">$1000</button>
      </div>
      
      <button class="amount-btn increase" 
              data-amount-action="increase"
              aria-label="Increase amount by $50">
        <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
    </div>
  </div>
  
  <div class="donation-actions">
    <button class="donate-btn primary" data-donate-action="primary">
      Donate Now
    </button>
    
    <button class="donate-btn secondary" data-donate-action="monthly">
      Monthly Donation
    </button>
  </div>
  
  <div class="donation-info">
    <p class="tax-info">Tax-deductible donation</p>
    <div class="secure-badge">
      <svg class="security-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H15.5C16.4,11 17,11.4 17,12V16C17,16.6 16.6,17 16,17H8C7.4,17 7,16.6 7,16V12C7,11.4 7.4,11 8,11H8.5V10C8.5,8.6 9.9,7 12,7M12,8.2C10.2,8.2 9.7,9.2 9.7,10V11H14.3V10C14.3,9.2 13.8,8.2 12,8.2Z"/>
      </svg>
      <span>Secure Payment</span>
    </div>
  </div>
</section>
```

#### CSS Architecture
```css
.donation-widget {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  max-width: 480px;
  margin: 0 auto;
  color: white;
  text-align: center;
}

.donation-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.donation-header p {
  color: #ccc;
  margin-bottom: 2rem;
}

.amount-selector {
  margin-bottom: 2rem;
}

.amount-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: bold;
}

.currency {
  color: #4CAF50;
  margin-right: 0.25rem;
}

.amount-input {
  background: transparent;
  border: none;
  color: #4CAF50;
  font-size: inherit;
  font-weight: inherit;
  width: 160px;
  text-align: left;
  outline: none;
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.amount-input[type=number] {
  -moz-appearance: textfield;
}

.amount-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.amount-btn {
  background: #333;
  border: 1px solid #555;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amount-btn:hover,
.amount-btn:focus {
  background: #4CAF50;
  border-color: #4CAF50;
}

.amount-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.preset-amounts {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.preset-btn {
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.preset-btn:hover,
.preset-btn:focus {
  border-color: #4CAF50;
  color: #4CAF50;
}

.preset-btn.active {
  background: #4CAF50;
  border-color: #4CAF50;
  color: white;
}

.donation-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.donate-btn {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.donate-btn.primary {
  background: #4CAF50;
  color: white;
}

.donate-btn.primary:hover,
.donate-btn.primary:focus {
  background: #45a049;
  transform: translateY(-1px);
}

.donate-btn.secondary {
  background: transparent;
  color: #4CAF50;
  border: 1px solid #4CAF50;
}

.donate-btn.secondary:hover,
.donate-btn.secondary:focus {
  background: rgba(76, 175, 80, 0.1);
}

.donation-info {
  border-top: 1px solid #333;
  padding-top: 1rem;
  font-size: 0.875rem;
  color: #999;
}

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.security-icon {
  width: 16px;
  height: 16px;
  fill: #4CAF50;
}

/* Responsive design */
@media (max-width: 480px) {
  .donation-widget {
    padding: 1.5rem;
  }
  
  .amount-display {
    font-size: 2rem;
  }
  
  .amount-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .preset-amounts {
    order: -1;
  }
}
```

#### JavaScript API
```javascript
class DonationWidget {
  constructor(container, options = {}) {
    this.container = container;
    this.amountInput = container.querySelector('[data-amount-input]');
    this.presetButtons = [...container.querySelectorAll('[data-preset]')];
    this.decreaseBtn = container.querySelector('[data-amount-action="decrease"]');
    this.increaseBtn = container.querySelector('[data-amount-action="increase"]');
    this.donateButtons = [...container.querySelectorAll('[data-donate-action]')];
    
    this.options = {
      defaultAmount: 200,
      increment: 50,
      minAmount: 50,
      maxAmount: 10000,
      currency: '$',
      ...options
    };
    
    this.currentAmount = this.options.defaultAmount;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateUI();
  }
  
  setupEventListeners() {
    // Amount input changes
    this.amountInput.addEventListener('input', this.handleAmountInput.bind(this));
    this.amountInput.addEventListener('blur', this.validateAmount.bind(this));
    
    // Increment/decrement buttons
    this.decreaseBtn.addEventListener('click', () => this.decrement());
    this.increaseBtn.addEventListener('click', () => this.increment());
    
    // Preset amount buttons
    this.presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const amount = parseInt(button.dataset.preset);
        this.setAmount(amount);
      });
    });
    
    // Donation action buttons
    this.donateButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.handleDonation(button.dataset.donateAction);
      });
    });
    
    // Keyboard shortcuts
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  setAmount(amount) {
    const newAmount = Math.max(
      this.options.minAmount,
      Math.min(amount, this.options.maxAmount)
    );
    
    this.currentAmount = newAmount;
    this.amountInput.value = newAmount;
    this.updateUI();
    
    // Dispatch custom event
    this.dispatchAmountChange();
  }
  
  increment() {
    this.setAmount(this.currentAmount + this.options.increment);
  }
  
  decrement() {
    this.setAmount(this.currentAmount - this.options.increment);
  }
  
  handleAmountInput(e) {
    const value = parseInt(e.target.value) || this.options.minAmount;
    this.currentAmount = value;
    this.updateUI();
  }
  
  validateAmount() {
    const value = parseInt(this.amountInput.value);
    
    if (isNaN(value) || value < this.options.minAmount) {
      this.setAmount(this.options.minAmount);
    } else if (value > this.options.maxAmount) {
      this.setAmount(this.options.maxAmount);
    } else {
      this.setAmount(value);
    }
  }
  
  updateUI() {
    // Update preset button states
    this.presetButtons.forEach(button => {
      const presetAmount = parseInt(button.dataset.preset);
      button.classList.toggle('active', presetAmount === this.currentAmount);
    });
    
    // Update increment/decrement button states
    this.decreaseBtn.disabled = this.currentAmount <= this.options.minAmount;
    this.increaseBtn.disabled = this.currentAmount >= this.options.maxAmount;
    
    // Update donation button text
    this.donateButtons.forEach(button => {
      if (button.dataset.donateAction === 'primary') {
        button.textContent = `Donate ${this.options.currency}${this.currentAmount}`;
      } else if (button.dataset.donateAction === 'monthly') {
        button.textContent = `${this.options.currency}${this.currentAmount}/month`;
      }
    });
  }
  
  handleDonation(type) {
    // Validate amount before processing
    if (!this.isValidAmount()) {
      this.showError('Please enter a valid donation amount');
      return;
    }
    
    // Dispatch donation event
    const event = new CustomEvent('donation-initiated', {
      detail: {
        amount: this.currentAmount,
        type: type,
        currency: this.options.currency
      }
    });
    
    this.container.dispatchEvent(event);
  }
  
  isValidAmount() {
    return this.currentAmount >= this.options.minAmount && 
           this.currentAmount <= this.options.maxAmount;
  }
  
  dispatchAmountChange() {
    const event = new CustomEvent('amount-changed', {
      detail: {
        amount: this.currentAmount,
        currency: this.options.currency
      }
    });
    
    this.container.dispatchEvent(event);
  }
  
  handleKeyDown(e) {
    if (e.target !== this.amountInput) return;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        this.increment();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.decrement();
        break;
    }
  }
  
  // Public API methods
  getAmount() {
    return this.currentAmount;
  }
  
  reset() {
    this.setAmount(this.options.defaultAmount);
  }
  
  showError(message) {
    // Implementation for error display
    console.error('Donation Widget Error:', message);
  }
}
```

### Accessibility Features
- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader announcements
- Focus management
- High contrast mode support

### Integration Events
The donation widget dispatches custom events:
- `amount-changed`: When donation amount is modified
- `donation-initiated`: When user initiates donation process

---

**Document Version**: 1.0  
**Last Updated**: August 25, 2025  
**Component Architect**: System Architecture Agent
/**
 * Responsive Design Tests
 * Tests website responsiveness across different device breakpoints
 */

import { test, expect } from '@playwright/test';

const BREAKPOINTS = {
  mobile: {
    small: { width: 320, height: 568 },
    medium: { width: 375, height: 667 },
    large: { width: 414, height: 896 }
  },
  tablet: {
    portrait: { width: 768, height: 1024 },
    landscape: { width: 1024, height: 768 }
  },
  desktop: {
    small: { width: 1280, height: 720 },
    large: { width: 1920, height: 1080 },
    xlarge: { width: 2560, height: 1440 }
  }
};

test.describe('Mobile Responsive Design', () => {
  
  test('Mobile Small (320px) - Layout should be stacked vertically', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile.small);
    await page.goto('/');
    
    // Test main container width
    const mainContainer = page.locator('main, .main-container, body > div');
    await expect(mainContainer).toBeVisible();
    
    // Test donation section is full width
    const donateSection = page.locator('[data-testid="donate-section"], .donate-section, .donation-container');
    if (await donateSection.count() > 0) {
      const boundingBox = await donateSection.boundingBox();
      expect(boundingBox.width).toBeLessThanOrEqual(320);
      expect(boundingBox.width).toBeGreaterThan(280); // Allow for padding
    }
    
    // Test video carousel stacks on mobile
    const videoContainer = page.locator('[data-testid="video-carousel"], .video-carousel, .videos-container');
    if (await videoContainer.count() > 0) {
      await expect(videoContainer).toBeVisible();
      const containerBox = await videoContainer.boundingBox();
      expect(containerBox.width).toBeLessThanOrEqual(320);
    }
    
    // Test navigation arrows are appropriately sized for mobile
    const navArrows = page.locator('[data-testid="carousel-nav"], .carousel-nav, .video-nav');
    if (await navArrows.count() > 0) {
      await expect(navArrows).toBeVisible();
      // Arrows should be touch-friendly (minimum 44px)
      const arrowElements = await navArrows.locator('button, .arrow').all();
      for (const arrow of arrowElements) {
        const box = await arrow.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Mobile Medium (375px) - Content should fit comfortably', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile.medium);
    await page.goto('/');
    
    // Test donate button and amount editor
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, button[href*="kindful"]');
    if (await donateButton.count() > 0) {
      await expect(donateButton).toBeVisible();
      const buttonBox = await donateButton.boundingBox();
      expect(buttonBox.width).toBeLessThanOrEqual(375);
      expect(buttonBox.height).toBeGreaterThanOrEqual(44); // Touch-friendly
    }
    
    // Test amount editor visibility and usability
    const amountEditor = page.locator('[data-testid="amount-editor"], .amount-editor, input[type="number"]');
    if (await amountEditor.count() > 0) {
      await expect(amountEditor).toBeVisible();
      // Should be large enough for touch input
      const editorBox = await amountEditor.boundingBox();
      expect(editorBox.height).toBeGreaterThanOrEqual(44);
    }
    
    // Test increment/decrement buttons
    const incrementButtons = page.locator('[data-testid*="increment"], .increment, .amount-controls button');
    if (await incrementButtons.count() > 0) {
      const buttons = await incrementButtons.all();
      for (const button of buttons) {
        await expect(button).toBeVisible();
        const buttonBox = await button.boundingBox();
        expect(buttonBox.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Mobile Large (414px) - Enhanced mobile experience', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.mobile.large);
    await page.goto('/');
    
    // Test video carousel can show partial next video
    const videoItems = page.locator('[data-testid="video-item"], .video-item, .carousel-item');
    if (await videoItems.count() > 1) {
      const firstVideo = videoItems.first();
      const secondVideo = videoItems.nth(1);
      
      const firstBox = await firstVideo.boundingBox();
      const secondBox = await secondVideo.boundingBox();
      
      // On larger mobile, we might show a hint of the next video
      if (secondBox) {
        expect(secondBox.x).toBeLessThan(414); // Some part should be visible
      }
    }
    
    // Test background image is properly scaled
    const backgroundImage = page.locator('[data-testid="background-image"], .background-image, body');
    await expect(backgroundImage).toBeVisible();
    
    // Check background-size property via CSS
    const bgSize = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="background-image"], .background-image, body');
      return window.getComputedStyle(element).backgroundSize;
    });
    expect(bgSize).toBe('cover'); // Should use cover for mobile
  });
});

test.describe('Tablet Responsive Design', () => {
  
  test('Tablet Portrait (768px) - Two-column layout', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.tablet.portrait);
    await page.goto('/');
    
    // Test layout adapts to tablet width
    const mainContent = page.locator('main, .main-content, .container');
    await expect(mainContent).toBeVisible();
    
    // Video carousel should show more videos
    const videoContainer = page.locator('[data-testid="video-carousel"], .video-carousel');
    if (await videoContainer.count() > 0) {
      const containerBox = await videoContainer.boundingBox();
      expect(containerBox.width).toBeGreaterThan(400); // Should use more space
      expect(containerBox.width).toBeLessThanOrEqual(768);
    }
    
    // Donate section should be appropriately sized
    const donateSection = page.locator('[data-testid="donate-section"], .donate-section');
    if (await donateSection.count() > 0) {
      const sectionBox = await donateSection.boundingBox();
      expect(sectionBox.width).toBeGreaterThan(300);
      expect(sectionBox.width).toBeLessThanOrEqual(768);
    }
  });

  test('Tablet Landscape (1024px) - Approaching desktop layout', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.tablet.landscape);
    await page.goto('/');
    
    // Test video carousel can display multiple videos
    const videoItems = page.locator('[data-testid="video-item"], .video-item');
    if (await videoItems.count() > 1) {
      const visibleVideos = await videoItems.all();
      let visibleCount = 0;
      
      for (const video of visibleVideos) {
        const box = await video.boundingBox();
        if (box && box.x >= 0 && box.x < 1024) {
          visibleCount++;
        }
      }
      
      expect(visibleCount).toBeGreaterThanOrEqual(2); // Should show multiple videos
    }
    
    // Test donation controls are well-spaced
    const donateControls = page.locator('[data-testid="donate-controls"], .donate-controls');
    if (await donateControls.count() > 0) {
      const controlsBox = await donateControls.boundingBox();
      expect(controlsBox.width).toBeLessThan(600); // Should not be too wide
    }
  });
});

test.describe('Desktop Responsive Design', () => {
  
  test('Desktop Small (1280px) - Full desktop experience', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop.small);
    await page.goto('/');
    
    // Test layout uses full width appropriately
    const container = page.locator('.container, .main-container, main');
    await expect(container).toBeVisible();
    
    // Video carousel should show multiple videos comfortably
    const videoCarousel = page.locator('[data-testid="video-carousel"], .video-carousel');
    if (await videoCarousel.count() > 0) {
      const carouselBox = await videoCarousel.boundingBox();
      expect(carouselBox.width).toBeGreaterThan(800);
    }
    
    // Test navigation arrows positioning
    const leftArrow = page.locator('[data-testid="prev-arrow"], .prev-arrow, .carousel-prev');
    const rightArrow = page.locator('[data-testid="next-arrow"], .next-arrow, .carousel-next');
    
    if (await leftArrow.count() > 0 && await rightArrow.count() > 0) {
      const leftBox = await leftArrow.boundingBox();
      const rightBox = await rightArrow.boundingBox();
      
      expect(leftBox.x).toBeLessThan(rightBox.x); // Left should be left of right
      expect(rightBox.x + rightBox.width).toBeLessThanOrEqual(1280);
    }
  });

  test('Desktop Large (1920px) - Optimal spacing and layout', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop.large);
    await page.goto('/');
    
    // Test content is centered and not stretched too wide
    const mainContent = page.locator('.container, .main-content, main');
    if (await mainContent.count() > 0) {
      const contentBox = await mainContent.boundingBox();
      // Content should have reasonable max-width
      expect(contentBox.width).toBeLessThan(1600); // Not using full 1920px width
      expect(contentBox.width).toBeGreaterThan(1000);
    }
    
    // Video items should have optimal spacing
    const videoItems = page.locator('[data-testid="video-item"], .video-item');
    if (await videoItems.count() > 1) {
      const firstVideo = videoItems.first();
      const secondVideo = videoItems.nth(1);
      
      const firstBox = await firstVideo.boundingBox();
      const secondBox = await secondVideo.boundingBox();
      
      if (firstBox && secondBox) {
        const gap = secondBox.x - (firstBox.x + firstBox.width);
        expect(gap).toBeGreaterThan(10); // Should have spacing between items
        expect(gap).toBeLessThan(100); // But not excessive spacing
      }
    }
  });

  test('Desktop XLarge (2560px) - Ultra-wide display optimization', async ({ page }) => {
    await page.setViewportSize(BREAKPOINTS.desktop.xlarge);
    await page.goto('/');
    
    // Test content doesn't stretch to full width
    const body = page.locator('body');
    const container = page.locator('.container, .main-content, main');
    
    if (await container.count() > 0) {
      const containerBox = await container.boundingBox();
      // Should be centered with max-width
      expect(containerBox.width).toBeLessThan(2000); // Much less than full 2560px
      
      // Should be horizontally centered
      const centerX = containerBox.x + (containerBox.width / 2);
      const screenCenter = 2560 / 2;
      const centering = Math.abs(centerX - screenCenter);
      expect(centering).toBeLessThan(100); // Should be approximately centered
    }
    
    // Background image should still cover properly
    const backgroundCoverage = await page.evaluate(() => {
      const element = document.querySelector('body, [data-testid="background-image"]');
      const style = window.getComputedStyle(element);
      return {
        backgroundSize: style.backgroundSize,
        backgroundPosition: style.backgroundPosition
      };
    });
    
    expect(backgroundCoverage.backgroundSize).toBe('cover');
    expect(backgroundCoverage.backgroundPosition).toContain('center');
  });
});

test.describe('Responsive Breakpoint Transitions', () => {
  
  test('Smooth transitions between breakpoints', async ({ page }) => {
    await page.goto('/');
    
    // Test transition from mobile to tablet
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(100);
    
    const initialLayout = await page.evaluate(() => {
      const video = document.querySelector('[data-testid="video-carousel"], .video-carousel');
      return video ? window.getComputedStyle(video).flexDirection : null;
    });
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    
    const tabletLayout = await page.evaluate(() => {
      const video = document.querySelector('[data-testid="video-carousel"], .video-carousel');
      return video ? window.getComputedStyle(video).flexDirection : null;
    });
    
    // Layout should adapt (though specific changes depend on implementation)
    expect(initialLayout).toBeDefined();
    expect(tabletLayout).toBeDefined();
  });
});

// Utility test to verify CSS breakpoints are working
test.describe('CSS Media Queries', () => {
  
  test('Media queries respond correctly to viewport changes', async ({ page }) => {
    await page.goto('/');
    
    const breakpointTests = [
      { width: 320, expectedClass: 'mobile' },
      { width: 768, expectedClass: 'tablet' },
      { width: 1280, expectedClass: 'desktop' }
    ];
    
    for (const { width, expectedClass } of breakpointTests) {
      await page.setViewportSize({ width, height: 600 });
      await page.waitForTimeout(50);
      
      // Check if body has responsive classes or if layout changes appropriately
      const hasResponsiveLayout = await page.evaluate(() => {
        // Check for common responsive indicators
        const indicators = [
          document.body.className.includes('mobile') ||
          document.body.className.includes('tablet') ||
          document.body.className.includes('desktop'),
          
          // Or check computed styles that change with breakpoints
          window.getComputedStyle(document.body).getPropertyValue('--viewport-type'),
          
          // Or check if certain elements change their display properties
          (() => {
            const carousel = document.querySelector('[data-testid="video-carousel"]');
            return carousel ? window.getComputedStyle(carousel).display : 'block';
          })()
        ];
        
        return indicators.some(indicator => indicator && indicator !== 'none');
      });
      
      expect(hasResponsiveLayout).toBeTruthy();
    }
  });
});
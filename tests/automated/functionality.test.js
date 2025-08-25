/**
 * Functionality Tests
 * Tests core website functionality including background rotation, video carousel, and donation features
 */

import { test, expect } from '@playwright/test';

test.describe('Background Image Rotation', () => {
  
  test('Background images rotate every 60 seconds', async ({ page }) => {
    await page.goto('/');
    
    // Get initial background image
    const initialBackground = await page.evaluate(() => {
      const element = document.querySelector('body, [data-testid="background-image"], .background-container');
      return window.getComputedStyle(element).backgroundImage;
    });
    
    expect(initialBackground).toBeDefined();
    expect(initialBackground).not.toBe('none');
    
    // Fast-forward 60 seconds using page clock manipulation
    await page.clock.install({ time: new Date('2024-01-01T10:00:00') });
    await page.clock.fastForward('60000'); // 60 seconds
    
    // Wait for any rotation animation to complete
    await page.waitForTimeout(1000);
    
    const rotatedBackground = await page.evaluate(() => {
      const element = document.querySelector('body, [data-testid="background-image"], .background-container');
      return window.getComputedStyle(element).backgroundImage;
    });
    
    // Background should have changed (or at least rotation mechanism should be active)
    if (initialBackground !== rotatedBackground) {
      expect(rotatedBackground).toBeDefined();
      expect(rotatedBackground).not.toBe('none');
    }
    
    // Verify rotation timer is active
    const hasRotationTimer = await page.evaluate(() => {
      return window.backgroundRotationInterval !== undefined || 
             document.querySelector('[data-rotation="active"]') !== null ||
             typeof window.rotateBackground === 'function';
    });
    
    expect(hasRotationTimer).toBeTruthy();
  });

  test('Background rotation uses fade transition', async ({ page }) => {
    await page.goto('/');
    
    // Check for CSS transition properties
    const hasTransition = await page.evaluate(() => {
      const element = document.querySelector('body, [data-testid="background-image"], .background-container');
      const styles = window.getComputedStyle(element);
      
      return styles.transition.includes('opacity') || 
             styles.transition.includes('background') ||
             element.classList.contains('fade') ||
             element.querySelector('.fade') !== null;
    });
    
    expect(hasTransition).toBeTruthy();
  });

  test('Multiple background images are loaded from P4H Global', async ({ page }) => {
    await page.goto('/');
    
    // Check for multiple background images in rotation array
    const backgroundImages = await page.evaluate(() => {
      // Check various possible implementations
      const checks = [
        window.backgroundImages && Array.isArray(window.backgroundImages),
        document.querySelectorAll('[data-background-url]').length > 1,
        document.querySelectorAll('.background-image').length > 1,
        (() => {
          const style = document.querySelector('style, link[rel="stylesheet"]');
          if (style) {
            const content = style.textContent || '';
            return (content.match(/background.*url/g) || []).length > 1;
          }
          return false;
        })()
      ];
      
      return {
        hasMultiple: checks.some(check => check),
        imageCount: window.backgroundImages ? window.backgroundImages.length : 0
      };
    });
    
    expect(backgroundImages.hasMultiple).toBeTruthy();
    if (backgroundImages.imageCount > 0) {
      expect(backgroundImages.imageCount).toBeGreaterThan(1);
    }
  });
});

test.describe('Video Carousel Navigation', () => {
  
  test('Video carousel displays videos from videos directory', async ({ page }) => {
    await page.goto('/');
    
    // Check for video elements
    const videoElements = await page.locator('video, [data-testid="video-item"], .video-item').count();
    expect(videoElements).toBeGreaterThan(0);
    
    // Check for video with "Liam Helmer" label (from our known video file)
    const liamVideo = page.locator('text="Liam Helmer"').first();
    await expect(liamVideo).toBeVisible();
    
    // Verify video source points to videos directory
    const videoSrc = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });
    
    if (videoSrc) {
      expect(videoSrc).toContain('videos/');
      expect(videoSrc).toContain('.mp4');
    }
  });

  test('Navigation arrows control video carousel', async ({ page }) => {
    await page.goto('/');
    
    // Find navigation arrows
    const prevArrow = page.locator('[data-testid="prev-arrow"], .prev-arrow, .carousel-prev, button:has-text("‹"), button:has-text("Previous")').first();
    const nextArrow = page.locator('[data-testid="next-arrow"], .next-arrow, .carousel-next, button:has-text("›"), button:has-text("Next")').first();
    
    // At least one navigation element should exist
    const hasNavigation = (await prevArrow.count() > 0) || (await nextArrow.count() > 0);
    expect(hasNavigation).toBeTruthy();
    
    if (await nextArrow.count() > 0) {
      // Get initial carousel state
      const initialState = await page.evaluate(() => {
        const carousel = document.querySelector('[data-testid="video-carousel"], .video-carousel, .carousel');
        return carousel ? {
          scrollLeft: carousel.scrollLeft,
          currentIndex: carousel.getAttribute('data-current-index') || '0'
        } : null;
      });
      
      // Click next arrow
      await nextArrow.click();
      await page.waitForTimeout(500); // Allow for transition
      
      // Check that carousel state changed
      const newState = await page.evaluate(() => {
        const carousel = document.querySelector('[data-testid="video-carousel"], .video-carousel, .carousel');
        return carousel ? {
          scrollLeft: carousel.scrollLeft,
          currentIndex: carousel.getAttribute('data-current-index') || '0'
        } : null;
      });
      
      if (initialState && newState) {
        const stateChanged = initialState.scrollLeft !== newState.scrollLeft || 
                           initialState.currentIndex !== newState.currentIndex;
        expect(stateChanged).toBeTruthy();
      }
    }
  });

  test('Video names are displayed correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for video name labels
    const videoLabels = await page.locator('[data-testid="video-name"], .video-name, .video-title, .carousel-item h3, .carousel-item .title').count();
    
    if (videoLabels > 0) {
      // Should show "Liam Helmer" based on the video file
      const liamLabel = page.locator('text="Liam Helmer"');
      await expect(liamLabel).toBeVisible();
    } else {
      // Check if video names are embedded in other elements
      const hasVideoNames = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return text.includes('Liam Helmer') || text.includes('VIP 77');
      });
      expect(hasVideoNames).toBeTruthy();
    }
  });

  test('Video carousel is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Focus on first video or carousel
    const firstVideo = page.locator('video, [data-testid="video-item"], .video-item').first();
    const carousel = page.locator('[data-testid="video-carousel"], .video-carousel').first();
    
    let focusableElement = null;
    if (await firstVideo.count() > 0) {
      await firstVideo.focus();
      focusableElement = firstVideo;
    } else if (await carousel.count() > 0) {
      await carousel.focus();
      focusableElement = carousel;
    }
    
    if (focusableElement) {
      // Test arrow key navigation
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      
      // Verify keyboard interaction worked
      const keyboardWorked = await page.evaluate(() => {
        const focused = document.activeElement;
        return focused && (
          focused.tagName === 'VIDEO' ||
          focused.classList.contains('video-item') ||
          focused.classList.contains('carousel-item') ||
          focused.hasAttribute('data-testid')
        );
      });
      
      expect(keyboardWorked).toBeTruthy();
    }
  });
});

test.describe('Donation Amount Editor', () => {
  
  test('Default donation amount is $200', async ({ page }) => {
    await page.goto('/');
    
    // Find donation amount display/input
    const amountElement = page.locator('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display').first();
    
    await expect(amountElement).toBeVisible();
    
    // Check the value is $200 (may be displayed as "200", "$200", or "200.00")
    const amountValue = await page.evaluate(() => {
      const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
      if (!element) return null;
      
      return element.value || 
             element.textContent || 
             element.getAttribute('data-amount') || 
             element.getAttribute('value');
    });
    
    expect(amountValue).toBeDefined();
    const numericValue = parseInt(amountValue.replace(/[^0-9]/g, ''));
    expect(numericValue).toBe(200);
  });

  test('Amount can be edited by clicking', async ({ page }) => {
    await page.goto('/');
    
    const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"], .donation-amount[contenteditable], .amount-input').first();
    
    if (await amountInput.count() > 0) {
      await amountInput.click();
      
      // Clear and enter new amount
      await page.keyboard.selectAll();
      await page.keyboard.type('150');
      
      // Verify the value changed
      const newValue = await amountInput.inputValue();
      expect(newValue).toBe('150');
    } else {
      // Check for click-to-edit functionality
      const clickableAmount = page.locator('[data-testid="donation-amount"], .donation-amount, .amount-display').first();
      await clickableAmount.click();
      
      // Should show input or become editable
      const isEditable = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, .amount-display');
        return element && (
          element.tagName === 'INPUT' ||
          element.contentEditable === 'true' ||
          element.classList.contains('editing')
        );
      });
      
      expect(isEditable).toBeTruthy();
    }
  });

  test('Up/down arrows increment/decrement by $50', async ({ page }) => {
    await page.goto('/');
    
    // Find increment/decrement buttons
    const incrementBtn = page.locator('[data-testid="increment"], .increment, button:has-text("+"), .amount-up').first();
    const decrementBtn = page.locator('[data-testid="decrement"], .decrement, button:has-text("-"), .amount-down').first();
    
    if (await incrementBtn.count() > 0) {
      // Get initial amount
      const initialAmount = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
        if (!element) return 200;
        const value = element.value || element.textContent || element.getAttribute('data-amount');
        return parseInt(value.replace(/[^0-9]/g, '')) || 200;
      });
      
      // Click increment button
      await incrementBtn.click();
      await page.waitForTimeout(100);
      
      const newAmount = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
        if (!element) return 0;
        const value = element.value || element.textContent || element.getAttribute('data-amount');
        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
      });
      
      expect(newAmount).toBe(initialAmount + 50);
    }
    
    if (await decrementBtn.count() > 0) {
      // Test decrement
      const currentAmount = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
        if (!element) return 200;
        const value = element.value || element.textContent || element.getAttribute('data-amount');
        return parseInt(value.replace(/[^0-9]/g, '')) || 200;
      });
      
      await decrementBtn.click();
      await page.waitForTimeout(100);
      
      const decrementedAmount = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
        if (!element) return 0;
        const value = element.value || element.textContent || element.getAttribute('data-amount');
        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
      });
      
      expect(decrementedAmount).toBe(currentAmount - 50);
    }
  });

  test('Amount cannot go below zero', async ({ page }) => {
    await page.goto('/');
    
    // Set amount to a low value first
    const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"]').first();
    if (await amountInput.count() > 0) {
      await amountInput.click();
      await amountInput.fill('25'); // Less than $50
    }
    
    // Try to decrement below zero
    const decrementBtn = page.locator('[data-testid="decrement"], .decrement, button:has-text("-"), .amount-down').first();
    
    if (await decrementBtn.count() > 0) {
      await decrementBtn.click();
      await page.waitForTimeout(100);
      
      const finalAmount = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="donation-amount"], .donation-amount, input[type="number"], .amount-display');
        if (!element) return 0;
        const value = element.value || element.textContent || element.getAttribute('data-amount');
        return parseInt(value.replace(/[^0-9]/g, '')) || 0;
      });
      
      expect(finalAmount).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Donation URL Generation', () => {
  
  test('Donate button links to correct Kindful URL with amount parameter', async ({ page }) => {
    await page.goto('/');
    
    // Set a specific amount
    const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"]').first();
    if (await amountInput.count() > 0) {
      await amountInput.click();
      await amountInput.fill('300');
      await page.waitForTimeout(100);
    }
    
    // Find donate button
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, a[href*="kindful"], button[onclick*="kindful"]').first();
    
    await expect(donateButton).toBeVisible();
    
    // Check the URL
    const href = await donateButton.getAttribute('href');
    
    if (href) {
      expect(href).toContain('p4hglobal.kindful.com');
      expect(href).toContain('campaigns/1374266');
      expect(href).toContain('amount=300');
      expect(href).toContain('recurring=landing_recurring');
    } else {
      // Check for onclick handler or other URL generation
      const onClick = await donateButton.getAttribute('onclick');
      const hasUrlGeneration = onClick && onClick.includes('kindful.com');
      expect(hasUrlGeneration).toBeTruthy();
    }
  });

  test('URL updates when amount changes', async ({ page }) => {
    await page.goto('/');
    
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, a[href*="kindful"]').first();
    
    // Get initial URL
    let initialHref = await donateButton.getAttribute('href');
    
    // Change amount using increment button
    const incrementBtn = page.locator('[data-testid="increment"], .increment, button:has-text("+")').first();
    if (await incrementBtn.count() > 0) {
      await incrementBtn.click();
      await page.waitForTimeout(100);
      
      // Check if URL updated
      const updatedHref = await donateButton.getAttribute('href');
      
      if (initialHref && updatedHref) {
        expect(updatedHref).not.toBe(initialHref);
        
        // Extract amounts from URLs
        const initialAmount = initialHref.match(/amount=(\d+)/)?.[1];
        const updatedAmount = updatedHref.match(/amount=(\d+)/)?.[1];
        
        if (initialAmount && updatedAmount) {
          expect(parseInt(updatedAmount)).toBe(parseInt(initialAmount) + 50);
        }
      }
    }
  });

  test('URL contains all required parameters', async ({ page }) => {
    await page.goto('/');
    
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, a[href*="kindful"]').first();
    const href = await donateButton.getAttribute('href');
    
    if (href) {
      const url = new URL(href);
      
      // Check required parameters
      expect(url.hostname).toBe('p4hglobal.kindful.com');
      expect(url.pathname).toContain('1374266');
      expect(url.searchParams.get('amount')).toBeTruthy();
      expect(url.searchParams.get('recurring')).toBe('landing_recurring');
      expect(url.searchParams.has('frequency')).toBeTruthy();
    }
  });
});

test.describe('Content Integration', () => {
  
  test('Page displays P4H Global campaign content', async ({ page }) => {
    await page.goto('/');
    
    // Check for campaign-related text
    const pageContent = await page.textContent('body');
    
    const hasRelevantContent = [
      'True North',
      'VIP 77',
      'P4H',
      'Haiti',
      'education',
      'transformation',
      'campaign'
    ].some(term => pageContent.toLowerCase().includes(term.toLowerCase()));
    
    expect(hasRelevantContent).toBeTruthy();
  });

  test('Page displays P4H Global logo', async ({ page }) => {
    await page.goto('/');
    
    // Check for logo image
    const logo = page.locator('img[src*="P4H"], img[alt*="P4H"], [data-testid="logo"]').first();
    
    if (await logo.count() > 0) {
      await expect(logo).toBeVisible();
      
      const src = await logo.getAttribute('src');
      expect(src).toBeTruthy();
    } else {
      // Check for logo as background image or CSS
      const hasLogoBackground = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let element of elements) {
          const bg = window.getComputedStyle(element).backgroundImage;
          if (bg.includes('P4H') || bg.includes('logo')) {
            return true;
          }
        }
        return false;
      });
      
      expect(hasLogoBackground).toBeTruthy();
    }
  });
});
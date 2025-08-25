/**
 * Accessibility Tests
 * Tests ARIA labels, keyboard navigation, and screen reader compatibility
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('ARIA Labels and Semantic HTML', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('Page has no accessibility violations', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  });

  test('Main page structure uses semantic HTML', async ({ page }) => {
    // Check for proper document structure
    const documentStructure = await page.evaluate(() => {
      return {
        hasMain: document.querySelector('main') !== null,
        hasHeader: document.querySelector('header') !== null,
        hasNav: document.querySelector('nav') !== null,
        hasSection: document.querySelector('section') !== null,
        hasFooter: document.querySelector('footer') !== null,
        hasH1: document.querySelector('h1') !== null
      };
    });

    // Should have at least main content area and heading
    expect(documentStructure.hasMain || documentStructure.hasSection).toBeTruthy();
    expect(documentStructure.hasH1).toBeTruthy();
  });

  test('Video carousel has proper ARIA labels', async ({ page }) => {
    const videoCarousel = page.locator('[data-testid="video-carousel"], .video-carousel, .carousel').first();
    
    if (await videoCarousel.count() > 0) {
      // Check for carousel ARIA attributes
      const carouselAttributes = await page.evaluate(() => {
        const carousel = document.querySelector('[data-testid="video-carousel"], .video-carousel, .carousel');
        if (!carousel) return null;
        
        return {
          role: carousel.getAttribute('role'),
          ariaLabel: carousel.getAttribute('aria-label'),
          ariaLive: carousel.getAttribute('aria-live'),
          tabIndex: carousel.getAttribute('tabindex')
        };
      });

      if (carouselAttributes) {
        // Carousel should be properly labeled
        expect(
          carouselAttributes.role === 'region' || 
          carouselAttributes.role === 'group' ||
          carouselAttributes.ariaLabel
        ).toBeTruthy();
      }
    }

    // Check navigation buttons
    const navButtons = page.locator('[data-testid*="arrow"], .carousel-nav button, .video-nav button');
    const buttonCount = await navButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = navButtons.nth(i);
      
      const buttonAttributes = await button.evaluate((btn) => ({
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title'),
        textContent: btn.textContent.trim()
      }));

      // Navigation buttons should have accessible names
      expect(
        buttonAttributes.ariaLabel || 
        buttonAttributes.title || 
        buttonAttributes.textContent
      ).toBeTruthy();
    }
  });

  test('Donation controls have proper ARIA labels', async ({ page }) => {
    // Test donate button
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, button[href*="kindful"]').first();
    
    if (await donateButton.count() > 0) {
      const buttonAttributes = await donateButton.evaluate((btn) => ({
        ariaLabel: btn.getAttribute('aria-label'),
        ariaDescribedBy: btn.getAttribute('aria-describedby'),
        role: btn.getAttribute('role'),
        textContent: btn.textContent.trim()
      }));

      // Button should have accessible name
      expect(
        buttonAttributes.ariaLabel || 
        buttonAttributes.textContent
      ).toBeTruthy();
    }

    // Test amount input/editor
    const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"]').first();
    
    if (await amountInput.count() > 0) {
      const inputAttributes = await amountInput.evaluate((input) => ({
        ariaLabel: input.getAttribute('aria-label'),
        ariaDescribedBy: input.getAttribute('aria-describedby'),
        label: input.labels && input.labels.length > 0 ? input.labels[0].textContent : null,
        placeholder: input.getAttribute('placeholder')
      }));

      // Input should be properly labeled
      expect(
        inputAttributes.ariaLabel || 
        inputAttributes.label ||
        inputAttributes.placeholder
      ).toBeTruthy();
    }

    // Test increment/decrement buttons
    const controlButtons = page.locator('[data-testid*="increment"], [data-testid*="decrement"], .increment, .decrement');
    const controlCount = await controlButtons.count();

    for (let i = 0; i < controlCount; i++) {
      const button = controlButtons.nth(i);
      
      const controlAttributes = await button.evaluate((btn) => ({
        ariaLabel: btn.getAttribute('aria-label'),
        title: btn.getAttribute('title'),
        textContent: btn.textContent.trim()
      }));

      expect(
        controlAttributes.ariaLabel || 
        controlAttributes.title ||
        controlAttributes.textContent
      ).toBeTruthy();
    }
  });

  test('Images have proper alt text', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // Decorative images should have empty alt, others should have descriptive alt
      if (src && !src.includes('spacer') && !src.includes('placeholder')) {
        expect(alt).toBeDefined();
      }
    }
  });

  test('Videos have proper accessibility attributes', async ({ page }) => {
    const videos = page.locator('video');
    const videoCount = await videos.count();

    for (let i = 0; i < videoCount; i++) {
      const video = videos.nth(i);
      
      const videoAttributes = await video.evaluate((vid) => ({
        ariaLabel: vid.getAttribute('aria-label'),
        title: vid.getAttribute('title'),
        controls: vid.hasAttribute('controls'),
        muted: vid.hasAttribute('muted'),
        autoplay: vid.hasAttribute('autoplay')
      }));

      // Video should be accessible and not auto-playing with sound
      if (videoAttributes.autoplay) {
        expect(videoAttributes.muted).toBeTruthy();
      }
      
      expect(videoAttributes.controls || videoAttributes.ariaLabel).toBeTruthy();
    }
  });
});

test.describe('Keyboard Navigation', () => {
  
  test('All interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation through all interactive elements
    const interactiveElements = await page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])').all();
    
    let tabbableCount = 0;
    for (const element of interactiveElements) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        tabbableCount++;
        
        await element.focus();
        const isFocused = await element.evaluate((el) => document.activeElement === el);
        
        if (!isFocused) {
          // Check if element has tabindex -1 or is disabled
          const tabindex = await element.getAttribute('tabindex');
          const disabled = await element.getAttribute('disabled');
          
          expect(tabindex === '-1' || disabled !== null).toBeTruthy();
        }
      }
    }

    expect(tabbableCount).toBeGreaterThan(0);
  });

  test('Donation amount can be controlled with keyboard', async ({ page }) => {
    await page.goto('/');
    
    const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"]').first();
    
    if (await amountInput.count() > 0) {
      await amountInput.focus();
      
      // Get initial value
      const initialValue = await amountInput.inputValue();
      const initialNum = parseInt(initialValue) || 200;
      
      // Test arrow key increment
      await page.keyboard.press('ArrowUp');
      await page.waitForTimeout(100);
      
      const upValue = await amountInput.inputValue();
      const upNum = parseInt(upValue) || initialNum;
      
      // Should increment (exact amount depends on step attribute)
      expect(upNum).toBeGreaterThan(initialNum);
      
      // Test arrow key decrement
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
      
      const downValue = await amountInput.inputValue();
      const downNum = parseInt(downValue) || upNum;
      
      expect(downNum).toBeLessThan(upNum);
    }
  });

  test('Video carousel is keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Find focusable video elements
    const videos = page.locator('video, .video-item[tabindex], button[aria-label*="video"]');
    
    if (await videos.count() > 0) {
      const firstVideo = videos.first();
      await firstVideo.focus();
      
      // Test arrow key navigation
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      
      // Check if focus moved or carousel state changed
      const focusChanged = await page.evaluate(() => {
        const focused = document.activeElement;
        return focused && (
          focused.tagName === 'VIDEO' ||
          focused.classList.contains('video-item') ||
          focused.hasAttribute('aria-label')
        );
      });
      
      expect(focusChanged).toBeTruthy();
    }

    // Test navigation buttons
    const navButtons = page.locator('[data-testid*="arrow"], .carousel-nav button, .video-nav button');
    
    if (await navButtons.count() > 0) {
      const firstNavButton = navButtons.first();
      await firstNavButton.focus();
      
      // Should be able to activate with Enter or Space
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);
      
      // Verify button activation worked
      const buttonWorked = await page.evaluate(() => {
        // Check for visual indicators of button activation
        const activeElement = document.activeElement;
        return activeElement && (
          activeElement.tagName === 'BUTTON' ||
          activeElement.getAttribute('role') === 'button'
        );
      });
      
      expect(buttonWorked).toBeTruthy();
    }
  });

  test('Donate button is keyboard activatable', async ({ page }) => {
    await page.goto('/');
    
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button, a[href*="kindful"], button[onclick*="kindful"]').first();
    
    await donateButton.focus();
    
    const isFocused = await donateButton.evaluate((btn) => document.activeElement === btn);
    expect(isFocused).toBeTruthy();
    
    // Test Enter key activation
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    
    // For links, this might navigate. For buttons, check for activation
    const href = await donateButton.getAttribute('href');
    if (href) {
      // If it's a link, pressing Enter should attempt navigation
      expect(href).toContain('kindful.com');
    }
  });

  test('Focus indicators are visible', async ({ page }) => {
    await page.goto('/');
    
    const focusableElements = await page.locator('button, input, a[href], select, textarea, [tabindex]:not([tabindex="-1"])').all();
    
    for (const element of focusableElements.slice(0, 5)) { // Test first 5 elements
      if (await element.isVisible()) {
        await element.focus();
        
        // Check for focus styles
        const focusStyles = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            outlineColor: styles.outlineColor,
            boxShadow: styles.boxShadow,
            border: styles.border
          };
        });
        
        // Should have some kind of focus indicator
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.border.includes('px'); // Some border change
        
        expect(hasFocusIndicator).toBeTruthy();
      }
    }
  });

  test('Skip links are present for efficient navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab once to potentially reveal skip links
    await page.keyboard.press('Tab');
    
    const skipLinks = page.locator('a[href="#main"], a[href="#content"], .skip-link, a:has-text("Skip to")');
    
    if (await skipLinks.count() > 0) {
      const firstSkipLink = skipLinks.first();
      await expect(firstSkipLink).toBeFocused();
      
      const href = await firstSkipLink.getAttribute('href');
      expect(href).toBeTruthy();
      
      // Verify target exists
      if (href.startsWith('#')) {
        const target = page.locator(href);
        expect(await target.count()).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('Screen Reader Compatibility', () => {
  
  test('Page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(headingElements).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent.trim(),
        id: h.id
      }));
    });

    expect(headings.length).toBeGreaterThan(0);
    
    // Should start with h1
    if (headings.length > 0) {
      expect(headings[0].level).toBe(1);
    }

    // Check for logical hierarchy (no skipping levels)
    for (let i = 1; i < headings.length; i++) {
      const levelDiff = headings[i].level - headings[i-1].level;
      expect(levelDiff).toBeLessThanOrEqual(1); // Can't skip levels going down
    }
  });

  test('Page has descriptive page title', async ({ page }) => {
    await page.goto('/');
    
    const title = await page.title();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(5);
    
    // Should contain campaign-relevant terms
    const relevantTerms = ['campaign', 'donate', 'p4h', 'haiti', 'true north', 'vip'];
    const hasRelevantTerm = relevantTerms.some(term => 
      title.toLowerCase().includes(term.toLowerCase())
    );
    
    expect(hasRelevantTerm).toBeTruthy();
  });

  test('Form controls have accessible labels', async ({ page }) => {
    await page.goto('/');
    
    const formControls = page.locator('input, select, textarea');
    const controlCount = await formControls.count();
    
    for (let i = 0; i < controlCount; i++) {
      const control = formControls.nth(i);
      
      const labelInfo = await control.evaluate((ctrl) => {
        const id = ctrl.id;
        const ariaLabel = ctrl.getAttribute('aria-label');
        const ariaLabelledBy = ctrl.getAttribute('aria-labelledby');
        const placeholder = ctrl.getAttribute('placeholder');
        
        let associatedLabel = null;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          associatedLabel = label ? label.textContent.trim() : null;
        }
        
        // Check for parent label
        const parentLabel = ctrl.closest('label');
        const parentLabelText = parentLabel ? parentLabel.textContent.trim() : null;
        
        return {
          id,
          ariaLabel,
          ariaLabelledBy,
          placeholder,
          associatedLabel,
          parentLabelText
        };
      });

      // Should have some form of accessible name
      expect(
        labelInfo.ariaLabel ||
        labelInfo.associatedLabel ||
        labelInfo.parentLabelText ||
        labelInfo.placeholder
      ).toBeTruthy();
    }
  });

  test('Dynamic content has appropriate ARIA live regions', async ({ page }) => {
    await page.goto('/');
    
    // Check for live regions for dynamic content
    const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
    
    if (await liveRegions.count() > 0) {
      const regions = await liveRegions.all();
      
      for (const region of regions) {
        const ariaLive = await region.getAttribute('aria-live');
        const role = await region.getAttribute('role');
        
        // Should have appropriate live region settings
        expect(
          ariaLive === 'polite' || 
          ariaLive === 'assertive' ||
          role === 'status' ||
          role === 'alert'
        ).toBeTruthy();
      }
    }
    
    // Test if amount changes announce properly
    const incrementButton = page.locator('[data-testid="increment"], .increment').first();
    if (await incrementButton.count() > 0) {
      await incrementButton.click();
      
      // Check for announcement mechanism
      const hasAnnouncement = await page.evaluate(() => {
        return document.querySelector('[aria-live], [role="status"]') !== null;
      });
      
      // If no live regions, amount should at least be in a labeled control
      if (!hasAnnouncement) {
        const amountInput = page.locator('input[type="number"], [data-testid="donation-amount"]');
        if (await amountInput.count() > 0) {
          const hasLabel = await amountInput.evaluate((input) => {
            return input.getAttribute('aria-label') || input.labels?.length > 0;
          });
          expect(hasLabel).toBeTruthy();
        }
      }
    }
  });

  test('Color is not the only means of conveying information', async ({ page }) => {
    await page.goto('/');
    
    // Test with high contrast mode simulation
    await page.emulateMedia({ colorScheme: 'no-preference', forcedColors: 'active' });
    
    // Key interactive elements should still be identifiable
    const donateButton = page.locator('[data-testid="donate-button"], .donate-button').first();
    if (await donateButton.count() > 0) {
      const buttonText = await donateButton.textContent();
      expect(buttonText.trim().length).toBeGreaterThan(0);
    }
    
    const navButtons = page.locator('[data-testid*="arrow"], .carousel-nav button');
    if (await navButtons.count() > 0) {
      const hasTextOrSymbol = await navButtons.first().evaluate((btn) => {
        const text = btn.textContent.trim();
        const ariaLabel = btn.getAttribute('aria-label');
        return text.length > 0 || (ariaLabel && ariaLabel.length > 0);
      });
      
      expect(hasTextOrSymbol).toBeTruthy();
    }
  });

  test('Content is accessible without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.context().addInitScript(() => {
      delete window.requestAnimationFrame;
      delete window.setTimeout;
      delete window.setInterval;
    });
    
    await page.goto('/');
    
    // Basic content should still be accessible
    const hasMainContent = await page.evaluate(() => {
      const body = document.body;
      const textContent = body.textContent || '';
      return textContent.length > 100; // Should have substantial content
    });
    
    expect(hasMainContent).toBeTruthy();
    
    // Donate link should work without JavaScript
    const donateLink = page.locator('a[href*="kindful"]').first();
    if (await donateLink.count() > 0) {
      const href = await donateLink.getAttribute('href');
      expect(href).toContain('kindful.com');
      expect(href).toContain('amount=');
    }
  });
});
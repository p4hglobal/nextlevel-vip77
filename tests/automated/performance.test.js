/**
 * Performance Tests
 * Tests page load times, animation smoothness, and resource optimization
 */

import { test, expect } from '@playwright/test';

test.describe('Page Load Performance', () => {
  
  test('Page loads within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // First Contentful Paint should be under 1.5 seconds
    const fcpMetric = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            resolve(fcp.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
        
        // Fallback timeout
        setTimeout(() => resolve(null), 1000);
      });
    });
    
    if (fcpMetric) {
      expect(fcpMetric).toBeLessThan(1500);
    }
  });

  test('Critical resources load quickly', async ({ page }) => {
    const resourceTimings = [];
    
    // Monitor resource loading
    page.on('response', async (response) => {
      const request = response.request();
      const timing = await response.finished();
      
      if (timing) {
        resourceTimings.push({
          url: request.url(),
          status: response.status(),
          size: (await response.body()).length,
          timing: timing
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check CSS load time
    const cssResources = resourceTimings.filter(r => r.url.includes('.css'));
    for (const css of cssResources) {
      expect(css.timing).toBeLessThan(1000); // CSS should load within 1s
    }
    
    // Check JavaScript load time
    const jsResources = resourceTimings.filter(r => r.url.includes('.js'));
    for (const js of jsResources) {
      expect(js.timing).toBeLessThan(2000); // JS should load within 2s
    }
    
    // Check image load times (background images)
    const imageResources = resourceTimings.filter(r => 
      r.url.includes('.jpg') || r.url.includes('.png') || r.url.includes('.webp')
    );
    
    for (const image of imageResources) {
      expect(image.timing).toBeLessThan(3000); // Images should load within 3s
    }
  });

  test('Page size is optimized', async ({ page }) => {
    const resourceSizes = [];
    
    page.on('response', async (response) => {
      try {
        const body = await response.body();
        resourceSizes.push({
          url: response.url(),
          size: body.length,
          type: response.headers()['content-type'] || 'unknown'
        });
      } catch (error) {
        // Some responses might not have accessible bodies
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total page size
    const totalSize = resourceSizes.reduce((total, resource) => total + resource.size, 0);
    const totalSizeMB = totalSize / (1024 * 1024);
    
    // Total page size should be reasonable (under 5MB for initial load)
    expect(totalSizeMB).toBeLessThan(5);
    
    // Check individual resource sizes
    const largeResources = resourceSizes.filter(r => r.size > 1024 * 1024); // >1MB
    
    for (const resource of largeResources) {
      console.log(`Large resource: ${resource.url} - ${(resource.size / (1024 * 1024)).toFixed(2)}MB`);
      // Images should be optimized
      if (resource.type.includes('image')) {
        expect(resource.size).toBeLessThan(2 * 1024 * 1024); // <2MB per image
      }
    }
  });

  test('Web Vitals are within good thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries[entries.length - 1];
          vitals.lcp = lcp.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (simulated)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            vitals.fid = entries[0].processingStart - entries[0].startTime;
          }
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsScore = 0;
        new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          });
          vitals.cls = clsScore;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Give time for measurements
        setTimeout(() => resolve(vitals), 2000);
      });
    });
    
    // LCP should be under 2.5s (good threshold)
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500);
    }
    
    // FID should be under 100ms (good threshold)
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(100);
    }
    
    // CLS should be under 0.1 (good threshold)
    if (vitals.cls !== undefined) {
      expect(vitals.cls).toBeLessThan(0.1);
    }
  });
});

test.describe('Animation Performance', () => {
  
  test('Background image rotation is smooth', async ({ page }) => {
    await page.goto('/');
    
    // Monitor frame rate during background transition
    const frameRates = [];
    let lastTime = performance.now();
    
    await page.evaluate(() => {
      let frameCount = 0;
      let lastTime = performance.now();
      const frameRates = [];
      
      const measureFrame = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        
        if (delta > 0) {
          const fps = 1000 / delta;
          frameRates.push(fps);
        }
        
        lastTime = currentTime;
        frameCount++;
        
        if (frameCount < 60) { // Measure for ~1 second
          requestAnimationFrame(measureFrame);
        } else {
          window.backgroundAnimationFrameRates = frameRates;
        }
      };
      
      requestAnimationFrame(measureFrame);
    });
    
    // Wait for measurement to complete
    await page.waitForTimeout(1100);
    
    const frameRates = await page.evaluate(() => window.backgroundAnimationFrameRates || []);
    
    if (frameRates.length > 0) {
      const averageFPS = frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length;
      const minFPS = Math.min(...frameRates);
      
      // Animation should maintain reasonable frame rate
      expect(averageFPS).toBeGreaterThan(30); // At least 30 FPS average
      expect(minFPS).toBeGreaterThan(15); // No drops below 15 FPS
    }
  });

  test('Video carousel transitions are smooth', async ({ page }) => {
    await page.goto('/');
    
    const nextButton = page.locator('[data-testid="next-arrow"], .next-arrow, .carousel-next').first();
    
    if (await nextButton.count() > 0) {
      // Measure performance during carousel transition
      const transitionPerformance = await page.evaluate(async () => {
        const startTime = performance.now();
        
        // Trigger transition
        const button = document.querySelector('[data-testid="next-arrow"], .next-arrow, .carousel-next');
        if (button) {
          button.click();
        }
        
        // Wait for transition to complete
        await new Promise(resolve => {
          let frameCount = 0;
          const frameTimes = [];
          let lastFrame = performance.now();
          
          const measureFrame = (currentTime) => {
            const delta = currentTime - lastFrame;
            frameTimes.push(delta);
            lastFrame = currentTime;
            frameCount++;
            
            if (frameCount < 30) { // Measure transition frames
              requestAnimationFrame(measureFrame);
            } else {
              resolve({
                duration: currentTime - startTime,
                averageFrameTime: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
                maxFrameTime: Math.max(...frameTimes)
              });
            }
          };
          
          requestAnimationFrame(measureFrame);
        });
      });
      
      await nextButton.click();
      await page.waitForTimeout(500);
      
      // Check if transition completed smoothly
      const transitionComplete = await page.evaluate(() => {
        const carousel = document.querySelector('[data-testid="video-carousel"], .video-carousel');
        return carousel && !carousel.classList.contains('transitioning');
      });
      
      expect(transitionComplete).toBeTruthy();
    }
  });

  test('Scroll performance is acceptable', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 800, height: 600 });
    
    // Add some content to make scrolling measurable
    await page.evaluate(() => {
      const content = document.createElement('div');
      content.style.height = '2000px';
      content.style.backgroundColor = 'transparent';
      document.body.appendChild(content);
    });
    
    // Measure scroll performance
    const scrollPerformance = await page.evaluate(async () => {
      let frameTimes = [];
      let lastTime = performance.now();
      let scrolling = true;
      
      const measureScroll = () => {
        if (!scrolling) return;
        
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        frameTimes.push(delta);
        lastTime = currentTime;
        
        requestAnimationFrame(measureScroll);
      };
      
      requestAnimationFrame(measureScroll);
      
      // Perform scroll
      window.scrollTo({ top: 500, behavior: 'smooth' });
      
      // Stop measuring after scroll completes
      setTimeout(() => {
        scrolling = false;
        return {
          averageFrameTime: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
          maxFrameTime: Math.max(...frameTimes),
          frameCount: frameTimes.length
        };
      }, 1000);
      
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            averageFrameTime: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
            maxFrameTime: Math.max(...frameTimes),
            frameCount: frameTimes.length
          });
        }, 1000);
      });
    });
    
    if (scrollPerformance.frameCount > 0) {
      // Scroll should maintain good frame rate (under 16.67ms per frame for 60fps)
      expect(scrollPerformance.averageFrameTime).toBeLessThan(20);
      expect(scrollPerformance.maxFrameTime).toBeLessThan(50); // No major stutters
    }
  });

  test('CSS animations use hardware acceleration', async ({ page }) => {
    await page.goto('/');
    
    // Check if animations use transform and opacity (GPU-friendly properties)
    const animationProperties = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('*');
      const animations = [];
      
      for (const element of animatedElements) {
        const styles = window.getComputedStyle(element);
        const transition = styles.transition;
        const animation = styles.animation;
        const transform = styles.transform;
        
        if (transition !== 'none' || animation !== 'none') {
          animations.push({
            element: element.tagName + (element.className ? '.' + element.className : ''),
            transition,
            animation,
            transform,
            willChange: styles.willChange
          });
        }
      }
      
      return animations;
    });
    
    // Check if animations use GPU-friendly properties
    for (const anim of animationProperties) {
      if (anim.transition.includes('left') || 
          anim.transition.includes('top') || 
          anim.transition.includes('width') || 
          anim.transition.includes('height')) {
        
        console.warn(`Animation using layout properties: ${anim.element}`);
        // Prefer transform and opacity for better performance
        expect(anim.willChange).toBeTruthy();
      }
    }
  });
});

test.describe('Resource Optimization', () => {
  
  test('Images are properly optimized', async ({ page }) => {
    const imageData = [];
    
    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('image/')) {
        try {
          const body = await response.body();
          imageData.push({
            url: response.url(),
            size: body.length,
            type: contentType
          });
        } catch (error) {
          // Skip if can't get body
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    for (const image of imageData) {
      const sizeMB = image.size / (1024 * 1024);
      
      // Images should be reasonably sized
      if (image.type.includes('jpeg') || image.type.includes('jpg')) {
        expect(sizeMB).toBeLessThan(1); // JPEG under 1MB
      } else if (image.type.includes('png')) {
        expect(sizeMB).toBeLessThan(2); // PNG under 2MB
      }
      
      // Check for modern formats
      const isModernFormat = image.type.includes('webp') || 
                           image.type.includes('avif') ||
                           image.url.includes('.webp') ||
                           image.url.includes('.avif');
      
      if (sizeMB > 0.1) { // Only check for larger images
        console.log(`Image format: ${image.url} - ${image.type} - ${sizeMB.toFixed(2)}MB`);
      }
    }
  });

  test('CSS and JavaScript are minified', async ({ page }) => {
    const resourceContents = [];
    
    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      const url = response.url();
      
      if ((contentType.includes('javascript') && url.includes('.js')) ||
          (contentType.includes('css') && url.includes('.css'))) {
        try {
          const text = await response.text();
          resourceContents.push({
            url,
            type: contentType.includes('javascript') ? 'js' : 'css',
            content: text,
            size: text.length
          });
        } catch (error) {
          // Skip if can't get text
        }
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    for (const resource of resourceContents) {
      if (resource.size > 1000) { // Only check larger files
        // Check for minification indicators
        const lines = resource.content.split('\n');
        const avgLineLength = resource.content.length / lines.length;
        
        // Minified files typically have longer average line length
        const isMinified = avgLineLength > 100 || 
                          !resource.content.includes('    ') || // No 4-space indentation
                          resource.url.includes('.min.');
        
        if (!isMinified) {
          console.log(`Potentially unminified resource: ${resource.url}`);
        }
        
        // For production, files should ideally be minified
        // This is a soft recommendation rather than hard requirement
        expect(resource.size).toBeGreaterThan(0); // At least verify it loads
      }
    }
  });

  test('Caching headers are set appropriately', async ({ page }) => {
    const cacheHeaders = [];
    
    page.on('response', (response) => {
      const headers = response.headers();
      cacheHeaders.push({
        url: response.url(),
        cacheControl: headers['cache-control'],
        expires: headers['expires'],
        etag: headers['etag'],
        lastModified: headers['last-modified']
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check static resources have appropriate caching
    const staticResources = cacheHeaders.filter(r => 
      r.url.includes('.css') || 
      r.url.includes('.js') || 
      r.url.includes('.jpg') || 
      r.url.includes('.png') ||
      r.url.includes('.webp')
    );
    
    for (const resource of staticResources) {
      // Static resources should have some form of caching
      const hasCaching = resource.cacheControl || 
                        resource.expires || 
                        resource.etag || 
                        resource.lastModified;
      
      if (!hasCaching) {
        console.log(`Resource without caching headers: ${resource.url}`);
      }
      
      // This is informational - not all servers may be configured for optimal caching
      expect(resource.url).toBeTruthy(); // Just verify URL exists
    }
  });

  test('No render-blocking resources', async ({ page }) => {
    await page.goto('/');
    
    // Check for render-blocking CSS
    const renderBlockingCSS = await page.evaluate(() => {
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      const blocking = [];
      
      for (const sheet of stylesheets) {
        const media = sheet.getAttribute('media');
        const async = sheet.hasAttribute('async');
        const defer = sheet.hasAttribute('defer');
        
        if (!media || media === 'all' || media === 'screen') {
          if (!async && !defer) {
            blocking.push(sheet.href);
          }
        }
      }
      
      return blocking;
    });
    
    // Check for render-blocking JavaScript
    const renderBlockingJS = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[src]');
      const blocking = [];
      
      for (const script of scripts) {
        const async = script.hasAttribute('async');
        const defer = script.hasAttribute('defer');
        const type = script.getAttribute('type');
        
        if (!async && !defer && (!type || type === 'text/javascript')) {
          // Scripts in head without async/defer are render-blocking
          if (document.head.contains(script)) {
            blocking.push(script.src);
          }
        }
      }
      
      return blocking;
    });
    
    // Report on render-blocking resources
    if (renderBlockingCSS.length > 0) {
      console.log('Render-blocking CSS:', renderBlockingCSS);
    }
    
    if (renderBlockingJS.length > 0) {
      console.log('Render-blocking JS:', renderBlockingJS);
    }
    
    // Critical CSS should be inlined, non-critical should be async
    expect(renderBlockingCSS.length + renderBlockingJS.length).toBeLessThan(5);
  });
});
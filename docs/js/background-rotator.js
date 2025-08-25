/**
 * Background Image Rotator
 * Manages rotating background images with smooth fade transitions
 * Images rotate every 60 seconds with 2-second fade effect
 */

class BackgroundRotator {
    constructor(containerSelector, imageUrls = [], interval = 60000) {
        this.container = document.querySelector(containerSelector);
        this.imageUrls = imageUrls;
        this.interval = interval;
        this.currentIndex = 0;
        this.backgroundElements = [];
        this.rotationTimer = null;
        
        // Default placeholder images if none provided
        if (this.imageUrls.length === 0) {
            this.imageUrls = this.getDefaultImages();
        }
        
        this.init();
    }
    
    /**
     * Get default placeholder images
     * These can be replaced with actual campaign images
     */
    getDefaultImages() {
        return [
            './images/bg1.jpg',  // P4H Global community work
            './images/bg2.jpg',  // Educational activities
            './images/bg3.jpg',  // Teacher training
            './images/bg4.jpg',  // Impact stories
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxZTFlMWUiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0b3AtY29sb3I9IiMzMDMwMzAiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMWUxZTFlIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MykiLz4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZGllbnQzIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI3MCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMjgyODI4Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzE1MTUxNSIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo='
        ];
    }
    
    /**
     * Initialize the background rotator
     */
    init() {
        if (!this.container) {
            console.warn('Background container not found');
            return;
        }
        
        this.createBackgroundElements();
        this.startRotation();
        
        // Store reference for memory coordination
        this.storeInMemory('background-rotator', {
            initialized: true,
            imageCount: this.imageUrls.length,
            interval: this.interval
        });
    }
    
    /**
     * Create DOM elements for each background image
     */
    createBackgroundElements() {
        this.imageUrls.forEach((url, index) => {
            const bgElement = document.createElement('div');
            bgElement.className = 'background-image';
            bgElement.style.backgroundImage = `url(${url})`;
            
            // Set first image as active
            if (index === 0) {
                bgElement.classList.add('active');
            }
            
            this.container.appendChild(bgElement);
            this.backgroundElements.push(bgElement);
        });
    }
    
    /**
     * Start the rotation timer
     */
    startRotation() {
        if (this.imageUrls.length <= 1) {
            return; // No need to rotate with only one image
        }
        
        this.rotationTimer = setInterval(() => {
            this.nextImage();
        }, this.interval);
    }
    
    /**
     * Transition to the next image
     */
    nextImage() {
        const currentElement = this.backgroundElements[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.imageUrls.length;
        const nextElement = this.backgroundElements[this.currentIndex];
        
        // Remove active class from current image
        currentElement.classList.remove('active');
        
        // Add active class to next image
        nextElement.classList.add('active');
        
        // Notify coordination hook
        this.notifyHook(`Switched to background image ${this.currentIndex + 1}`);
    }
    
    /**
     * Manually switch to a specific image by index
     */
    switchToImage(index) {
        if (index < 0 || index >= this.imageUrls.length) {
            console.warn('Invalid image index:', index);
            return;
        }
        
        const currentElement = this.backgroundElements[this.currentIndex];
        currentElement.classList.remove('active');
        
        this.currentIndex = index;
        const nextElement = this.backgroundElements[this.currentIndex];
        nextElement.classList.add('active');
        
        // Reset timer
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.startRotation();
        }
    }
    
    /**
     * Add new images to the rotation
     */
    addImages(newImageUrls) {
        newImageUrls.forEach(url => {
            const bgElement = document.createElement('div');
            bgElement.className = 'background-image';
            bgElement.style.backgroundImage = `url(${url})`;
            
            this.container.appendChild(bgElement);
            this.backgroundElements.push(bgElement);
            this.imageUrls.push(url);
        });
        
        // Restart rotation if it wasn't running
        if (!this.rotationTimer && this.imageUrls.length > 1) {
            this.startRotation();
        }
    }
    
    /**
     * Pause the rotation
     */
    pause() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
    }
    
    /**
     * Resume the rotation
     */
    resume() {
        if (!this.rotationTimer && this.imageUrls.length > 1) {
            this.startRotation();
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
        
        this.backgroundElements.forEach(element => {
            element.remove();
        });
        
        this.backgroundElements = [];
    }
    
    /**
     * Store data in coordination memory
     */
    storeInMemory(key, data) {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const memoryKey = `swarm/background-rotator/${key}`;
                localStorage.setItem(memoryKey, JSON.stringify({
                    ...data,
                    timestamp: Date.now()
                }));
            } catch (error) {
                console.warn('Could not store in memory:', error);
            }
        }
    }
    
    /**
     * Notify coordination hook
     */
    notifyHook(message) {
        if (typeof window !== 'undefined') {
            // Dispatch custom event for coordination
            const event = new CustomEvent('swarm:background-rotator', {
                detail: {
                    component: 'background-rotator',
                    action: 'image-switched',
                    message: message,
                    currentIndex: this.currentIndex,
                    timestamp: Date.now()
                }
            });
            window.dispatchEvent(event);
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundRotator;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.BackgroundRotator = BackgroundRotator;
}
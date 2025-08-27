/**
 * Video Carousel Component
 * Handles video navigation with smooth transitions
 * Works with static files - no server required
 */

class VideoCarousel {
    constructor(carouselSelector, videosData = []) {
        this.carousel = document.querySelector(carouselSelector);
        this.videosData = videosData;
        this.currentIndex = 0;
        
        // DOM elements
        this.videoWrapper = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.indicators = null;
        
        this.init();
    }
    
    /**
     * Initialize the video carousel
     */
    init() {
        if (!this.carousel) {
            console.warn('Video carousel container not found');
            return;
        }
        
        this.setupElements();
        this.createVideoSlides();
        this.createIndicators();
        this.bindEvents();
        this.showVideo(0);
    }
    
    /**
     * Setup DOM element references
     */
    setupElements() {
        this.videoWrapper = this.carousel.querySelector('#video-wrapper');
        this.prevBtn = this.carousel.querySelector('#prev-btn');
        this.nextBtn = this.carousel.querySelector('#next-btn');
        this.indicators = document.querySelector('#video-indicators');
    }
    
    /**
     * Create video slides
     */
    createVideoSlides() {
        if (!this.videoWrapper || this.videosData.length === 0) return;
        
        this.videoWrapper.innerHTML = '';
        this.videoWrapper.style.position = 'relative';
        this.videoWrapper.style.width = '100%';
        // Responsive height based on screen size
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        this.videoWrapper.style.height = isSmallMobile ? '450px' : isMobile ? '550px' : '600px';
        
        this.videosData.forEach((video, index) => {
            const slide = document.createElement('div');
            slide.className = 'video-slide';
            slide.style.position = 'absolute';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.display = index === 0 ? 'block' : 'none';
            slide.style.opacity = index === 0 ? '1' : '0';
            slide.style.transition = 'opacity 0.5s ease';
            
            // Create video container with poster image
            const videoContainer = document.createElement('div');
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.position = 'relative';
            videoContainer.style.background = '#000';
            videoContainer.style.borderRadius = '12px';
            videoContainer.style.overflow = 'hidden';
            
            // Check if video file exists, otherwise show poster
            if (video.src && !video.src.includes('placeholder')) {
                const videoElement = document.createElement('video');
                videoElement.src = video.src;
                videoElement.poster = video.poster;
                videoElement.controls = true;
                videoElement.style.width = '100%';
                videoElement.style.height = '100%';
                videoElement.style.objectFit = 'contain';
                videoContainer.appendChild(videoElement);
            } else {
                // Show poster image with play button overlay
                const posterImg = document.createElement('div');
                posterImg.style.width = '100%';
                posterImg.style.height = '100%';
                posterImg.style.backgroundImage = `url('${video.poster}')`;
                posterImg.style.backgroundSize = 'cover';
                posterImg.style.backgroundPosition = 'center';
                posterImg.style.position = 'relative';
                
                // Add play button overlay
                const playButton = document.createElement('div');
                playButton.innerHTML = '▶';
                playButton.style.position = 'absolute';
                playButton.style.top = '50%';
                playButton.style.left = '50%';
                playButton.style.transform = 'translate(-50%, -50%)';
                playButton.style.width = '80px';
                playButton.style.height = '80px';
                playButton.style.background = 'rgba(255, 255, 255, 0.9)';
                playButton.style.borderRadius = '50%';
                playButton.style.display = 'flex';
                playButton.style.alignItems = 'center';
                playButton.style.justifyContent = 'center';
                playButton.style.fontSize = '36px';
                playButton.style.color = '#000';
                playButton.style.cursor = 'pointer';
                playButton.style.transition = 'transform 0.3s ease';
                
                playButton.onmouseover = () => {
                    playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
                };
                
                playButton.onmouseout = () => {
                    playButton.style.transform = 'translate(-50%, -50%) scale(1)';
                };
                
                posterImg.appendChild(playButton);
                videoContainer.appendChild(posterImg);
            }
            
            // Add title and description
            const infoContainer = document.createElement('div');
            infoContainer.style.position = 'absolute';
            infoContainer.style.bottom = '0';
            infoContainer.style.left = '0';
            infoContainer.style.right = '0';
            infoContainer.style.padding = '20px';
            infoContainer.style.background = 'linear-gradient(transparent, rgba(0,0,0,0.9))';
            infoContainer.style.color = '#fff';
            
            const title = document.createElement('h3');
            title.textContent = video.title;
            title.style.margin = '0 0 10px 0';
            title.style.fontSize = '1.5rem';
            
            const description = document.createElement('p');
            description.textContent = video.description;
            description.style.margin = '0';
            description.style.fontSize = '0.9rem';
            description.style.opacity = '0.9';
            
            infoContainer.appendChild(title);
            infoContainer.appendChild(description);
            
            slide.appendChild(videoContainer);
            slide.appendChild(infoContainer);
            this.videoWrapper.appendChild(slide);
        });
    }
    
    /**
     * Create indicator dots
     */
    createIndicators() {
        if (!this.indicators || this.videosData.length === 0) return;
        
        this.indicators.innerHTML = '';
        
        this.videosData.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'indicator';
            if (index === 0) dot.classList.add('active');
            dot.onclick = () => this.showVideo(index);
            this.indicators.appendChild(dot);
        });
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.onclick = () => this.previousVideo();
        }
        
        if (this.nextBtn) {
            this.nextBtn.onclick = () => this.nextVideo();
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousVideo();
            if (e.key === 'ArrowRight') this.nextVideo();
        });
    }
    
    /**
     * Show specific video
     */
    showVideo(index) {
        const slides = this.videoWrapper.querySelectorAll('.video-slide');
        const indicators = this.indicators.querySelectorAll('.indicator');
        
        // Hide all slides
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'block';
                setTimeout(() => {
                    slide.style.opacity = '1';
                }, 10);
            } else {
                slide.style.opacity = '0';
                setTimeout(() => {
                    slide.style.display = 'none';
                }, 500);
            }
        });
        
        // Update indicators
        indicators.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Pause any playing videos
        const videos = this.videoWrapper.querySelectorAll('video');
        videos.forEach((video, i) => {
            if (i !== index) {
                video.pause();
            }
        });
        
        this.currentIndex = index;
    }
    
    /**
     * Navigate to previous video
     */
    previousVideo() {
        const newIndex = this.currentIndex === 0 
            ? this.videosData.length - 1 
            : this.currentIndex - 1;
        this.showVideo(newIndex);
    }
    
    /**
     * Navigate to next video
     */
    nextVideo() {
        const newIndex = (this.currentIndex + 1) % this.videosData.length;
        this.showVideo(newIndex);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoCarousel;
}
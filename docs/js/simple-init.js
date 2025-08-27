/**
 * Simple initialization for static HTML files
 * Ensures all components work without server
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing website components...');
    
    // Initialize background rotator
    initBackgroundRotator();
    
    // Initialize video carousel
    initVideoCarousel();
    
    // Background rotator
    function initBackgroundRotator() {
        const container = document.getElementById('background-container');
        if (!container) {
            console.warn('Background container not found');
            return;
        }
        
        const images = [
            './images/bg1.jpg',
            './images/bg2.jpg',
            './images/bg3.jpg',
            './images/bg4.jpg'
        ];
        
        let currentIndex = 0;
        const elements = [];
        
        // Create image elements
        images.forEach((src, index) => {
            const div = document.createElement('div');
            div.className = 'background-image';
            div.style.backgroundImage = `url('${src}')`;
            div.style.position = 'absolute';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            div.style.opacity = index === 0 ? '0.7' : '0';
            div.style.transition = 'opacity 2s ease-in-out';
            
            container.appendChild(div);
            elements.push(div);
        });
        
        // Show first image
        if (elements[0]) {
            elements[0].style.opacity = '0.7';
        }
        
        // Rotate images every 60 seconds
        setInterval(function() {
            // Hide current
            elements[currentIndex].style.opacity = '0';
            
            // Show next
            currentIndex = (currentIndex + 1) % images.length;
            elements[currentIndex].style.opacity = '0.7';
            
            console.log('Background rotated to image', currentIndex + 1);
        }, 60000);
        
        console.log('Background rotator initialized with', images.length, 'images');
    }
    
    // Video carousel
    function initVideoCarousel() {
        const wrapper = document.getElementById('video-wrapper');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const indicators = document.getElementById('video-indicators');
        
        if (!wrapper || !prevBtn || !nextBtn) {
            console.warn('Video carousel elements not found');
            return;
        }
        
        const videos = [
                  {
                            "title": "Callie Westlake",
                            "description": "Callie Westlake - Part of the True North VIP 77 campaign for P4H Global.",
                            "poster": "./images/Callie Westlake_thumb.jpg",
                            "src": "./videos/Callie Westlake.mp4"
                  },
                  {
                            "title": "Debbie Lingscheit",
                            "description": "Debbie Lingscheit - Part of the True North VIP 77 campaign for P4H Global.",
                            "poster": "./images/Debbie Lingscheit_thumb.jpg",
                            "src": "./videos/Debbie Lingscheit.mp4"
                  },
                  {
                            "title": "Katie Dumaine",
                            "description": "VIP 77 Student sharing their commitment to transforming education in Haiti.",
                            "poster": "./images/Katie Dumaine_thumb.jpg",
                            "src": "./videos/Katie Dumaine.mp4"
                  },
                  {
                            "title": "Liam Helmer",
                            "description": "VIP 77 Student testimonial supporting P4H Global's educational mission in Haiti.",
                            "poster": "./images/Liam Helmer_thumb.jpg",
                            "src": "./videos/Liam Helmer.mp4"
                  },
                  {
                            "title": "Quavion Porter",
                            "description": "Quavion Porter - Part of the True North VIP 77 campaign for P4H Global.",
                            "poster": "./images/Quavion Porter_thumb.jpg",
                            "src": "./videos/Quavion Porter.mp4"
                  },
                  {
                            "title": "Randy Strunk",
                            "description": "Randy Strunk - Part of the True North VIP 77 campaign for P4H Global.",
                            "poster": "./images/Randy Strunk_thumb.jpg",
                            "src": "./videos/Randy Strunk.mp4"
                  },
                  {
                            "title": "Stephen Fowler",
                            "description": "Stephen Fowler - Part of the True North VIP 77 campaign for P4H Global.",
                            "poster": "./images/Stephen Fowler_thumb.jpg",
                            "src": "./videos/Stephen Fowler.mp4"
                  }
];
        
        let currentVideo = 0;
        let autoRotateInterval = null;
        let pauseTimeout = null;
        const AUTO_ROTATE_DELAY = 15000; // 15 seconds
        const PAUSE_DURATION = 300000; // 5 minutes
        
        // Clear wrapper
        wrapper.innerHTML = '';
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        wrapper.style.height = '600px';  // Increased for portrait videos
        wrapper.style.background = '#000';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        
        // Create video elements
        videos.forEach((video, index) => {
            const slide = document.createElement('div');
            slide.className = 'video-slide';
            slide.style.position = 'absolute';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.display = index === 0 ? 'block' : 'none';
            
            // Create container for video and title
            const videoContainer = document.createElement('div');
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.display = 'flex';
            videoContainer.style.flexDirection = 'column';
            
            // Create video element
            const videoElement = document.createElement('video');
            videoElement.src = video.src;
            videoElement.poster = video.poster;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            videoElement.style.flex = '1';
            videoElement.style.objectFit = 'contain';  // Ensures video fits without cropping
            videoElement.style.background = '#000';
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = 'calc(100% - 60px)'; // Leave space for title
            
            // Create title element
            const titleElement = document.createElement('div');
            titleElement.className = 'video-title-display';
            titleElement.style.height = '60px';
            titleElement.style.padding = '15px';
            titleElement.style.background = 'rgba(0, 0, 0, 0.9)';
            titleElement.style.color = '#ffffff';
            titleElement.style.fontSize = '1.3rem';
            titleElement.style.fontWeight = '600';
            titleElement.style.textAlign = 'center';
            titleElement.style.display = 'flex';
            titleElement.style.alignItems = 'center';
            titleElement.style.justifyContent = 'center';
            titleElement.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
            titleElement.textContent = video.title;
            
            // Add error handling
            videoElement.onerror = function() {
                console.log('Video not found, showing poster');
                slide.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
                        <div style="flex: 1; background: url('${video.poster}') center/cover; position: relative;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                        width: 80px; height: 80px; background: rgba(255,255,255,0.9); 
                                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                        font-size: 36px; cursor: pointer;">▶</div>
                        </div>
                        <div style="height: 60px; padding: 15px; background: rgba(0, 0, 0, 0.9);
                                    color: white; font-size: 1.3rem; font-weight: 600; text-align: center;
                                    display: flex; align-items: center; justify-content: center;
                                    border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            ${video.title}
                        </div>
                    </div>
                `;
            };
            
            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(titleElement);
            slide.appendChild(videoContainer);
            wrapper.appendChild(slide);
        });
        
        // Create indicators
        if (indicators) {
            indicators.innerHTML = '';
            
            // Create indicator dots
            videos.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'indicator';
                if (index === 0) dot.classList.add('active');
                dot.style.width = '12px';
                dot.style.height = '12px';
                dot.style.borderRadius = '50%';
                dot.style.background = index === 0 ? '#fff' : 'rgba(255,255,255,0.3)';
                dot.style.display = 'inline-block';
                dot.style.margin = '0 5px';
                dot.style.cursor = 'pointer';
                dot.onclick = function() {
                    showVideo(index);
                    pauseAutoRotate();
                };
                indicators.appendChild(dot);
            });
        }
        
        // Navigation functions
        function showVideo(index) {
            const slides = wrapper.querySelectorAll('.video-slide');
            const dots = indicators ? indicators.querySelectorAll('.indicator') : [];
            
            // Pause any playing videos
            slides.forEach((slide, i) => {
                const video = slide.querySelector('video');
                if (video && i !== index) {
                    video.pause();
                }
                slide.style.display = i === index ? 'block' : 'none';
            });
            
            dots.forEach((dot, i) => {
                dot.style.background = i === index ? '#fff' : 'rgba(255,255,255,0.3)';
            });
            
            currentVideo = index;
        }
        
        // Auto-rotation functions
        function startAutoRotate() {
            // Clear any existing interval
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
            }
            
            autoRotateInterval = setInterval(function() {
                const nextIndex = (currentVideo + 1) % videos.length;
                showVideo(nextIndex);
                console.log('Auto-rotated to video', nextIndex + 1);
            }, AUTO_ROTATE_DELAY);
            
            console.log('Auto-rotation started (15 seconds)');
        }
        
        function pauseAutoRotate() {
            // Clear the rotation interval
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
                console.log('Auto-rotation paused for 5 minutes');
            }
            
            // Clear any existing pause timeout
            if (pauseTimeout) {
                clearTimeout(pauseTimeout);
            }
            
            // Set timeout to resume after 5 minutes
            pauseTimeout = setTimeout(function() {
                startAutoRotate();
                console.log('Auto-rotation resumed after 5 minute pause');
            }, PAUSE_DURATION);
        }
        
        // Bind navigation buttons with pause functionality
        prevBtn.onclick = function() {
            const newIndex = currentVideo === 0 ? videos.length - 1 : currentVideo - 1;
            showVideo(newIndex);
            pauseAutoRotate();
        };
        
        nextBtn.onclick = function() {
            const newIndex = (currentVideo + 1) % videos.length;
            showVideo(newIndex);
            pauseAutoRotate();
        };
        
        // Hide navigation if only one video
        if (videos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            if (indicators) indicators.style.display = 'none';
        } else {
            // Start auto-rotation only if there are multiple videos
            startAutoRotate();
        }
        
        // Add event listeners to pause auto-rotation when user plays a video
        const allVideos = wrapper.querySelectorAll('video');
        allVideos.forEach(video => {
            video.addEventListener('play', function() {
                pauseAutoRotate();
                console.log('Auto-rotation paused - user started playing video');
            });
        });
        
        console.log('Video carousel initialized with', videos.length, 'videos');
    }
    
    console.log('All components initialized successfully');
});
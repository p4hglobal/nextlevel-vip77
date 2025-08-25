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
                title: "Liam Helmer",
                description: "VIP 77 Student testimonial supporting P4H Global's educational mission in Haiti.",
                poster: "./images/bg1.jpg",
                src: "./videos/Liam Helmer.mp4"
            }
        ];
        
        let currentVideo = 0;
        
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
            
            // Check if video file exists
            const videoElement = document.createElement('video');
            videoElement.src = video.src;
            videoElement.poster = video.poster;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'contain';  // Ensures video fits without cropping
            videoElement.style.background = '#000';
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = '100%';
            
            // Add error handling
            videoElement.onerror = function() {
                console.log('Video not found, showing poster');
                slide.innerHTML = `
                    <div style="width: 100%; height: 100%; background: url('${video.poster}') center/cover; position: relative;">
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.9));">
                            <h3 style="color: white; margin: 0 0 10px 0;">${video.title}</h3>
                            <p style="color: white; margin: 0; opacity: 0.9; font-size: 14px;">${video.description}</p>
                        </div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    width: 80px; height: 80px; background: rgba(255,255,255,0.9); 
                                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                                    font-size: 36px; cursor: pointer;">▶</div>
                    </div>
                `;
            };
            
            slide.appendChild(videoElement);
            wrapper.appendChild(slide);
        });
        
        // Create indicators
        if (indicators) {
            indicators.innerHTML = '';
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
                };
                indicators.appendChild(dot);
            });
        }
        
        // Navigation functions
        function showVideo(index) {
            const slides = wrapper.querySelectorAll('.video-slide');
            const dots = indicators ? indicators.querySelectorAll('.indicator') : [];
            
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            
            dots.forEach((dot, i) => {
                dot.style.background = i === index ? '#fff' : 'rgba(255,255,255,0.3)';
            });
            
            currentVideo = index;
        }
        
        // Bind navigation buttons
        prevBtn.onclick = function() {
            const newIndex = currentVideo === 0 ? videos.length - 1 : currentVideo - 1;
            showVideo(newIndex);
        };
        
        nextBtn.onclick = function() {
            const newIndex = (currentVideo + 1) % videos.length;
            showVideo(newIndex);
        };
        
        // Hide navigation if only one video
        if (videos.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            if (indicators) indicators.style.display = 'none';
        }
        
        console.log('Video carousel initialized with', videos.length, 'videos');
    }
    
    console.log('All components initialized successfully');
});
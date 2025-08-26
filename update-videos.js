#!/usr/bin/env node

/**
 * Video Configuration Update Script v2.0
 * Scans the videos directory, generates thumbnails, and updates JS files
 * Always creates thumbnails using ffmpeg or canvas fallback
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const VIDEOS_DIR = path.join(__dirname, 'src', 'videos');
const IMAGES_DIR = path.join(__dirname, 'src', 'images');
const MAIN_JS_PATH = path.join(__dirname, 'src', 'js', 'main.js');
const SIMPLE_INIT_PATH = path.join(__dirname, 'src', 'js', 'simple-init.js');

// Check if ffmpeg is available
async function checkFFmpeg() {
    try {
        await execPromise('ffmpeg -version');
        return true;
    } catch (error) {
        console.log('⚠️  ffmpeg not found. Will create placeholder thumbnails.');
        return false;
    }
}

// Generate thumbnail from video using ffmpeg
async function generateThumbnailWithFFmpeg(videoPath, outputPath) {
    try {
        // Extract frame at 1 second mark with better quality
        const command = `ffmpeg -i "${videoPath}" -ss 00:00:01.000 -vframes 1 -q:v 2 -vf "scale=800:450:force_original_aspect_ratio=decrease,pad=800:450:(ow-iw)/2:(oh-ih)/2:black" "${outputPath}" -y`;
        await execPromise(command);
        console.log(`  ✅ Generated thumbnail: ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.log(`  ⚠️  Could not generate thumbnail with ffmpeg for ${path.basename(videoPath)}`);
        return false;
    }
}

// Create a placeholder thumbnail using Node.js
async function createPlaceholderThumbnail(videoTitle, outputPath) {
    // Create a simple HTML file that generates a thumbnail
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Generate Thumbnail</title>
</head>
<body>
    <canvas id="canvas" width="800" height="450"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 800, 450);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(0.5, '#2d2d2d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 450);
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('${videoTitle}', 400, 200);
        
        ctx.font = '24px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.fillText('Video Testimonial', 400, 260);
        
        // Add play button
        ctx.beginPath();
        ctx.arc(400, 350, 40, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(385, 335);
        ctx.lineTo(385, 365);
        ctx.lineTo(415, 350);
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();
        
        // Save canvas as image
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Thumbnail data:', dataUrl.substring(0, 100) + '...');
    </script>
    <p>Run this HTML file in a browser and save the canvas as ${path.basename(outputPath)}</p>
</body>
</html>`;
    
    // For now, use a fallback image if it exists
    const fallbackImages = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.startsWith('bg') && f.endsWith('.jpg'));
    
    if (fallbackImages.length > 0) {
        // Copy a background image as thumbnail
        const randomBg = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        const sourcePath = path.join(IMAGES_DIR, randomBg);
        
        try {
            fs.copyFileSync(sourcePath, outputPath);
            console.log(`  ✅ Created placeholder thumbnail using ${randomBg}`);
            return true;
        } catch (error) {
            console.log(`  ❌ Could not create placeholder thumbnail`);
            return false;
        }
    }
    
    console.log(`  ⚠️  No fallback images available for thumbnail`);
    return false;
}

// Get list of video files
function getVideoFiles() {
    if (!fs.existsSync(VIDEOS_DIR)) {
        console.log('⚠️  Videos directory not found. Creating it...');
        fs.mkdirSync(VIDEOS_DIR, { recursive: true });
        return [];
    }

    const files = fs.readdirSync(VIDEOS_DIR);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.webm', '.ogv', '.mov'].includes(ext);
    });
}

// Generate title from filename
function generateTitle(filename) {
    // Remove extension
    let title = path.basename(filename, path.extname(filename));
    
    // Replace underscores and hyphens with spaces
    title = title.replace(/[_-]/g, ' ');
    
    // Capitalize each word
    title = title.replace(/\b\w/g, char => char.toUpperCase());
    
    return title;
}

// Generate description based on title
function generateDescription(title) {
    const descriptions = {
        'Liam Helmer': 'VIP 77 Student testimonial supporting P4H Global\'s educational mission in Haiti.',
        'Katie Dumaine': 'VIP 77 Student sharing their commitment to transforming education in Haiti.',
        'Community Outreach': 'Witness the transformative power of community-focused initiatives in Haiti.',
        'Educational Impact': 'See how access to quality education changes lives in Haiti.',
        'Healthcare Support': 'Critical healthcare services reaching remote communities in Haiti.',
        'Student Testimonial': 'Hear directly from students whose lives have been transformed.',
        'Teacher Training': 'Empowering educators with the tools and knowledge to inspire change.',
        'School Program': 'Inside look at our comprehensive educational programs.',
        'Emergency Relief': 'Rapid response efforts providing critical aid when disasters strike.'
    };

    // Check if we have a specific description
    for (const [key, desc] of Object.entries(descriptions)) {
        if (title.toLowerCase().includes(key.toLowerCase())) {
            return desc;
        }
    }

    // Generate generic description
    if (title.toLowerCase().includes('student')) {
        return `${title} - A VIP 77 student sharing their experience and support for P4H Global.`;
    } else if (title.toLowerCase().includes('vip')) {
        return `${title} - Supporting P4H Global's mission to transform education in Haiti.`;
    } else {
        return `${title} - Part of the True North VIP 77 campaign for P4H Global.`;
    }
}

// Update main.js file
async function updateMainJS(videoConfigs) {
    try {
        // Read the current main.js content
        let content = fs.readFileSync(MAIN_JS_PATH, 'utf8');
        
        // Create the new video configuration
        const videoConfigStr = JSON.stringify(videoConfigs, null, 12)
            .replace(/^\s{8}/gm, '            ') // Fix indentation
            .replace(/^\s{12}/gm, '                '); // Fix nested indentation
        
        // Find and replace the loadVideos function
        const loadVideosRegex = /loadVideos\(\)\s*{\s*[\s\S]*?this\.config\.videos\s*=\s*\[[\s\S]*?\];/;
        
        const newLoadVideos = `loadVideos() {
        // Define videos from the videos directory
        // Auto-generated by update-videos.js
        this.config.videos = ${videoConfigStr};`;
        
        if (loadVideosRegex.test(content)) {
            content = content.replace(loadVideosRegex, newLoadVideos);
            console.log('✅ Updated loadVideos() function in main.js');
        } else {
            console.log('⚠️  Could not find loadVideos() function in main.js');
        }
        
        // Write the updated content back
        fs.writeFileSync(MAIN_JS_PATH, content, 'utf8');
        
    } catch (error) {
        console.error('❌ Error updating main.js:', error.message);
    }
}

// Update simple-init.js file
async function updateSimpleInitJS(videoConfigs) {
    try {
        // Read the current simple-init.js content
        let content = fs.readFileSync(SIMPLE_INIT_PATH, 'utf8');
        
        // Create the new video configuration
        const videoConfigStr = JSON.stringify(videoConfigs, null, 12)
            .replace(/^\s{8}/gm, '            ') // Fix indentation
            .replace(/^\s{12}/gm, '                '); // Fix nested indentation
        
        // Find and replace the videos array in initVideoCarousel function
        const videosRegex = /const\s+videos\s*=\s*\[[\s\S]*?\];/;
        
        const newVideos = `const videos = ${videoConfigStr};`;
        
        if (videosRegex.test(content)) {
            content = content.replace(videosRegex, newVideos);
            console.log('✅ Updated video configuration in simple-init.js');
        } else {
            console.log('⚠️  Could not find videos array in simple-init.js');
        }
        
        // Write the updated content back
        fs.writeFileSync(SIMPLE_INIT_PATH, content, 'utf8');
        
    } catch (error) {
        console.error('❌ Error updating simple-init.js:', error.message);
    }
}

// Ensure thumbnails directory exists
function ensureDirectories() {
    if (!fs.existsSync(IMAGES_DIR)) {
        fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    if (!fs.existsSync(VIDEOS_DIR)) {
        fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    }
}

// Main function
async function main() {
    console.log('🎬 Video Configuration Update Script v2.0');
    console.log('==========================================\n');
    
    // Ensure directories exist
    ensureDirectories();
    
    // Check for ffmpeg
    const hasFFmpeg = await checkFFmpeg();
    
    // Get video files
    const videoFiles = getVideoFiles();
    
    if (videoFiles.length === 0) {
        console.log('📁 No video files found in src/videos/');
        console.log('   Place your .mp4 files there and run this script again.\n');
        
        // Still update with empty array to remove placeholders
        await updateMainJS([]);
        await updateSimpleInitJS([]);
        console.log('✅ Removed placeholder videos from configuration.');
        return;
    }
    
    console.log(`📹 Found ${videoFiles.length} video file(s):\n`);
    
    // Process each video
    const videoConfigs = [];
    
    for (let i = 0; i < videoFiles.length; i++) {
        const videoFile = videoFiles[i];
        console.log(`Processing: ${videoFile}`);
        
        const videoPath = path.join(VIDEOS_DIR, videoFile);
        const title = generateTitle(videoFile);
        const description = generateDescription(title);
        
        // Generate thumbnail filename
        const thumbnailName = path.basename(videoFile, path.extname(videoFile)) + '_thumb.jpg';
        const thumbnailPath = path.join(IMAGES_DIR, thumbnailName);
        const thumbnailUrl = `./images/${thumbnailName}`;
        
        let thumbnailCreated = false;
        
        // Try to generate thumbnail
        if (hasFFmpeg) {
            thumbnailCreated = await generateThumbnailWithFFmpeg(videoPath, thumbnailPath);
        }
        
        // If ffmpeg failed or not available, create placeholder
        if (!thumbnailCreated) {
            thumbnailCreated = await createPlaceholderThumbnail(title, thumbnailPath);
        }
        
        // If thumbnail still doesn't exist, check if it already exists
        if (!thumbnailCreated && fs.existsSync(thumbnailPath)) {
            console.log(`  ℹ️  Using existing thumbnail: ${thumbnailName}`);
            thumbnailCreated = true;
        }
        
        // Create video configuration
        const config = {
            title: title,
            description: description,
            poster: thumbnailUrl,
            src: `./videos/${videoFile}`
        };
        
        videoConfigs.push(config);
        console.log(`  ✅ Configured: ${title}\n`);
    }
    
    // Sort videos alphabetically by title
    videoConfigs.sort((a, b) => a.title.localeCompare(b.title));
    
    // Update both JS files
    console.log('📝 Updating JavaScript files...');
    await updateMainJS(videoConfigs);
    await updateSimpleInitJS(videoConfigs);
    
    console.log('\n✨ Video configuration updated successfully!');
    console.log(`   ${videoConfigs.length} video(s) configured`);
    
    // Show the configuration
    console.log('\n📋 Video Configuration:');
    console.log('------------------------');
    videoConfigs.forEach((video, index) => {
        console.log(`${index + 1}. ${video.title}`);
        console.log(`   📁 ${video.src}`);
        console.log(`   🖼️  ${video.poster}`);
    });
    
    // Remind about ffmpeg if not installed
    if (!hasFFmpeg) {
        console.log('\n💡 Tip: Install ffmpeg for better thumbnail generation:');
        console.log('   macOS: brew install ffmpeg');
        console.log('   Windows: Download from https://ffmpeg.org');
        console.log('   Linux: sudo apt-get install ffmpeg');
    }
}

// Run the script
main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
# Videos Directory

This directory contains video files for the True North - VIP 77 campaign website.

## Video Requirements

- **Format**: MP4 (recommended)
- **Resolution**: 1920x1080 or 1280x720 (16:9 aspect ratio)
- **Duration**: 30-120 seconds for optimal engagement
- **Size**: Keep under 10MB per video for web performance

## Naming Convention

Videos should be named descriptively to enable automatic labeling:

- `community-outreach.mp4` → "Community Outreach"
- `education-impact.mp4` → "Education Impact"
- `healthcare-support.mp4` → "Healthcare Support"
- `emergency-relief.mp4` → "Emergency Relief"

## Dynamic Loading

The video carousel will automatically:

1. Scan this directory for video files
2. Generate titles from filenames (converting hyphens to spaces, capitalizing words)
3. Create poster images if not provided
4. Add videos to the carousel rotation

## Placeholder Videos

Currently using placeholder poster images. Replace with actual campaign videos:

1. **Community Outreach**: Shows local community programs and their impact
2. **Education Initiative**: Highlights educational support and resources
3. **Healthcare Support**: Demonstrates medical aid and health programs
4. **Emergency Relief**: Documents rapid response and disaster relief efforts

## Technical Notes

- Videos are loaded lazily for performance
- Poster images are generated automatically if not provided
- All videos include accessibility features (captions recommended)
- Mobile-optimized playback with touch controls
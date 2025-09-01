#!/usr/bin/env node

/**
 * Generate PDF Flyer from HTML
 * Converts the campaign flyer HTML to a PDF file
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    try {
        // Launch headless browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport to letter size
        await page.setViewport({
            width: 816,  // 8.5 inches at 96 DPI
            height: 1056 // 11 inches at 96 DPI
        });
        
        // Load the HTML file
        const htmlPath = path.join(__dirname, '..', 'docs', 'campaign-flyer.html');
        const fileUrl = `file://${htmlPath}`;
        
        console.log(`📄 Loading HTML from: ${htmlPath}`);
        await page.goto(fileUrl, {
            waitUntil: 'networkidle0'
        });
        
        // Wait a bit for any images to fully load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate PDF
        const pdfPath = path.join(__dirname, '..', 'docs', 'campaign-flyer.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'Letter',
            printBackground: true,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        });
        
        console.log(`✅ PDF generated successfully: ${pdfPath}`);
        
        // Get file size
        const stats = fs.statSync(pdfPath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`📊 File size: ${fileSizeInMB} MB`);
        
        await browser.close();
        
        return pdfPath;
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    generatePDF().then(() => {
        console.log('🎉 PDF generation complete!');
        process.exit(0);
    }).catch(error => {
        console.error('Failed to generate PDF:', error);
        process.exit(1);
    });
}

module.exports = generatePDF;
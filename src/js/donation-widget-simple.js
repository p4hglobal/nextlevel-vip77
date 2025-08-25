/**
 * Simple Donation Widget - Works with static HTML files
 * No server or complex initialization required
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing donation widget...');
    
    // Configuration
    const config = {
        defaultAmount: 200,
        minAmount: 50,
        maxAmount: 10000,
        increment: 50,
        baseUrl: 'https://p4hglobal.kindful.com/campaigns/1374266'
    };
    
    let currentAmount = config.defaultAmount;
    
    // Get elements
    const amountInput = document.getElementById('amount-input');
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const donateBtn = document.getElementById('donate-btn');
    
    // Check if elements exist
    if (!amountInput || !decreaseBtn || !increaseBtn || !donateBtn) {
        console.error('Donation widget elements not found');
        return;
    }
    
    console.log('Donation widget elements found');
    
    // Initialize display
    amountInput.value = currentAmount;
    updateButtonStates();
    
    // Decrease amount
    decreaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Decrease clicked');
        const newAmount = currentAmount - config.increment;
        if (newAmount >= config.minAmount) {
            currentAmount = newAmount;
            amountInput.value = currentAmount;
            updateButtonStates();
            console.log('Amount decreased to:', currentAmount);
        }
    });
    
    // Increase amount
    increaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Increase clicked');
        const newAmount = currentAmount + config.increment;
        if (newAmount <= config.maxAmount) {
            currentAmount = newAmount;
            amountInput.value = currentAmount;
            updateButtonStates();
            console.log('Amount increased to:', currentAmount);
        }
    });
    
    // Handle direct input
    amountInput.addEventListener('input', function(e) {
        let value = parseInt(e.target.value) || 0;
        if (value < config.minAmount) value = config.minAmount;
        if (value > config.maxAmount) value = config.maxAmount;
        currentAmount = value;
        updateButtonStates();
    });
    
    // Round to nearest increment on blur
    amountInput.addEventListener('blur', function(e) {
        currentAmount = Math.round(currentAmount / config.increment) * config.increment;
        if (currentAmount < config.minAmount) currentAmount = config.minAmount;
        if (currentAmount > config.maxAmount) currentAmount = config.maxAmount;
        amountInput.value = currentAmount;
        updateButtonStates();
        console.log('Amount rounded to:', currentAmount);
    });
    
    // Handle donation
    donateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const donationUrl = config.baseUrl + '?frequency=&amount=' + currentAmount;
        console.log('Opening donation URL:', donationUrl);
        
        // Open in new window
        window.open(donationUrl, '_blank');
    });
    
    // Update button states
    function updateButtonStates() {
        // Update decrease button
        if (currentAmount <= config.minAmount) {
            decreaseBtn.disabled = true;
            decreaseBtn.style.opacity = '0.5';
        } else {
            decreaseBtn.disabled = false;
            decreaseBtn.style.opacity = '1';
        }
        
        // Update increase button
        if (currentAmount >= config.maxAmount) {
            increaseBtn.disabled = true;
            increaseBtn.style.opacity = '0.5';
        } else {
            increaseBtn.disabled = false;
            increaseBtn.style.opacity = '1';
        }
    }
    
    console.log('Donation widget initialized successfully');
});
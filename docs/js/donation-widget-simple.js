/**
 * Simple Donation Widget - Works with static HTML files
 * Dynamic increment/decrement based on current amount
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing donation widget...');
    
    // Configuration
    const config = {
        defaultAmount: 200,
        minAmount: 0,
        maxAmount: 10000,
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
    
    // Dynamic increment/decrement logic
    function getIncrementAmount(value) {
        if (value >= 0 && value <= 45) return 5;
        if (value === 50) return 10;
        if (value >= 60 && value <= 90) return 10;
        if (value === 100) return 25;
        if (value >= 125 && value <= 225) return 25;
        if (value === 250) return 50;
        if (value >= 300) return 50;
        // Default cases for in-between values
        if (value > 45 && value < 60) return 10;
        if (value > 90 && value < 125) return 25;
        if (value > 225 && value < 300) return 50;
        return 25; // Fallback
    }
    
    function getDecrementAmount(value) {
        if (value >= 0 && value <= 45) return 5;
        if (value === 50) return 5;
        if (value >= 60 && value <= 90) return 10;
        if (value === 100) return 10;
        if (value >= 125 && value <= 225) return 25;
        if (value === 250) return 25;
        if (value >= 300) return 50;
        // Default cases for in-between values
        if (value > 45 && value < 60) return 5;
        if (value > 90 && value < 125) return 10;
        if (value > 225 && value < 300) return 25;
        return 25; // Fallback
    }
    
    // Initialize display
    amountInput.value = currentAmount;
    updateButtonStates();
    updateDonateButton();
    
    // Decrease amount
    decreaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Decrease clicked');
        const decrementAmount = getDecrementAmount(currentAmount);
        const newAmount = Math.max(config.minAmount, currentAmount - decrementAmount);
        currentAmount = newAmount;
        amountInput.value = currentAmount;
        updateButtonStates();
        updateDonateButton();
        console.log(`Amount decreased by ${decrementAmount} to: ${currentAmount}`);
    });
    
    // Increase amount
    increaseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Increase clicked');
        const incrementAmount = getIncrementAmount(currentAmount);
        const newAmount = Math.min(config.maxAmount, currentAmount + incrementAmount);
        currentAmount = newAmount;
        amountInput.value = currentAmount;
        updateButtonStates();
        updateDonateButton();
        console.log(`Amount increased by ${incrementAmount} to: ${currentAmount}`);
    });
    
    // Handle direct input - allow any typed value
    amountInput.addEventListener('input', function(e) {
        let value = parseInt(e.target.value) || 0;
        // Allow any value within min/max range
        if (value < config.minAmount) value = config.minAmount;
        if (value > config.maxAmount) value = config.maxAmount;
        currentAmount = value;
        updateButtonStates();
        updateDonateButton();
    });
    
    // Keep typed value on blur (don't round to increment)
    amountInput.addEventListener('blur', function(e) {
        // Just ensure it's within bounds
        if (currentAmount < config.minAmount) currentAmount = config.minAmount;
        if (currentAmount > config.maxAmount) currentAmount = config.maxAmount;
        amountInput.value = currentAmount;
        updateButtonStates();
        updateDonateButton();
        console.log('Final amount:', currentAmount);
    });
    
    // Handle Enter key in input field
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            donateBtn.click();
        }
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
            decreaseBtn.style.cursor = 'not-allowed';
        } else {
            decreaseBtn.disabled = false;
            decreaseBtn.style.opacity = '1';
            decreaseBtn.style.cursor = 'pointer';
        }
        
        // Update increase button
        if (currentAmount >= config.maxAmount) {
            increaseBtn.disabled = true;
            increaseBtn.style.opacity = '0.5';
            increaseBtn.style.cursor = 'not-allowed';
        } else {
            increaseBtn.disabled = false;
            increaseBtn.style.opacity = '1';
            increaseBtn.style.cursor = 'pointer';
        }
        
        // Show current increment/decrement amounts in tooltips
        if (!decreaseBtn.disabled) {
            decreaseBtn.title = `-$${getDecrementAmount(currentAmount)}`;
        } else {
            decreaseBtn.title = 'Minimum amount reached';
        }
        
        if (!increaseBtn.disabled) {
            increaseBtn.title = `+$${getIncrementAmount(currentAmount)}`;
        } else {
            increaseBtn.title = 'Maximum amount reached';
        }
    }
    
    // Update donate button text to show amount
    function updateDonateButton() {
        if (currentAmount > 0) {
            donateBtn.textContent = `Donate $${currentAmount}`;
        } else {
            donateBtn.textContent = 'Select Amount';
        }
    }
    
    console.log('Donation widget initialized successfully');
});
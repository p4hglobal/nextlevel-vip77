/**
 * Donation Widget Component
 * Handles donation amount editing and URL generation
 * Supports $50 increments and direct input editing
 */

class DonationWidget {
    constructor(widgetSelector, options = {}) {
        this.widget = document.querySelector(widgetSelector);
        this.options = {
            defaultAmount: 200,
            minAmount: 50,
            maxAmount: 10000,
            increment: 50,
            baseUrl: 'https://p4hglobal.kindful.com/campaigns/1374266',
            urlParams: {
                recurring: 'landing_recurring',
                frequency: ''
            },
            ...options
        };
        
        this.currentAmount = this.options.defaultAmount;
        
        // DOM elements
        this.amountInput = null;
        this.decreaseBtn = null;
        this.increaseBtn = null;
        this.donateBtn = null;
        
        this.init();
    }
    
    /**
     * Initialize the donation widget
     */
    init() {
        if (!this.widget) {
            console.warn('Donation widget container not found');
            return;
        }
        
        this.setupElements();
        this.bindEvents();
        this.updateDisplay();
        
        // Store in memory for coordination
        this.storeInMemory('widget', {
            initialized: true,
            defaultAmount: this.options.defaultAmount,
            currentAmount: this.currentAmount
        });
        
        this.notifyHook('Donation widget initialized');
    }
    
    /**
     * Setup DOM element references
     */
    setupElements() {
        this.amountInput = this.widget.querySelector('#amount-input');
        this.decreaseBtn = this.widget.querySelector('#decrease-btn');
        this.increaseBtn = this.widget.querySelector('#increase-btn');
        this.donateBtn = this.widget.querySelector('#donate-btn');
        
        if (!this.amountInput || !this.decreaseBtn || !this.increaseBtn || !this.donateBtn) {
            console.warn('Required donation widget elements not found');
            return;
        }
        
        // Set initial value
        this.amountInput.value = this.currentAmount;
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Amount input events
        if (this.amountInput) {
            // Direct input editing
            this.amountInput.addEventListener('input', (e) => {
                this.handleDirectInput(e);
            });
            
            // Blur event to validate and round to nearest increment
            this.amountInput.addEventListener('blur', (e) => {
                this.validateAndRoundAmount(e);
            });
            
            // Enter key to trigger donation
            this.amountInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.validateAndRoundAmount(e);
                    this.handleDonation();
                }
            });
            
            // Select all on focus for easy editing
            this.amountInput.addEventListener('focus', (e) => {
                e.target.select();
            });
        }
        
        // Decrease button
        if (this.decreaseBtn) {
            this.decreaseBtn.addEventListener('click', () => {
                this.decreaseAmount();
            });
        }
        
        // Increase button
        if (this.increaseBtn) {
            this.increaseBtn.addEventListener('click', () => {
                this.increaseAmount();
            });
        }
        
        // Donate button
        if (this.donateBtn) {
            this.donateBtn.addEventListener('click', () => {
                this.handleDonation();
            });
        }
        
        // Keyboard shortcuts when widget is focused
        this.widget.addEventListener('keydown', (e) => {
            if (e.target === this.amountInput) return; // Skip if input is focused
            
            switch (e.key) {
                case 'ArrowUp':
                case '+':
                    e.preventDefault();
                    this.increaseAmount();
                    break;
                case 'ArrowDown':
                case '-':
                    e.preventDefault();
                    this.decreaseAmount();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.handleDonation();
                    break;
            }
        });
    }
    
    /**
     * Handle direct input in the amount field
     */
    handleDirectInput(event) {
        const value = event.target.value;
        
        // Remove non-numeric characters except decimal point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        
        // Parse the cleaned value
        const numericValue = parseFloat(cleanValue) || 0;
        
        // Update the input field with cleaned value
        if (cleanValue !== value) {
            event.target.value = cleanValue;
        }
        
        // Update current amount (will be validated on blur)
        this.currentAmount = numericValue;
    }
    
    /**
     * Validate and round amount to nearest increment
     */
    validateAndRoundAmount(event) {
        let amount = parseFloat(event.target.value) || this.options.defaultAmount;
        
        // Ensure minimum amount
        if (amount < this.options.minAmount) {
            amount = this.options.minAmount;
        }
        
        // Ensure maximum amount
        if (amount > this.options.maxAmount) {
            amount = this.options.maxAmount;
        }
        
        // Round to nearest increment
        amount = Math.round(amount / this.options.increment) * this.options.increment;
        
        // Update current amount and display
        this.currentAmount = amount;
        this.updateDisplay();
        
        this.notifyHook(`Amount validated and set to $${amount}`);
    }
    
    /**
     * Increase donation amount by increment
     */
    increaseAmount() {
        const newAmount = this.currentAmount + this.options.increment;
        
        if (newAmount <= this.options.maxAmount) {
            this.currentAmount = newAmount;
            this.updateDisplay();
            this.notifyHook(`Amount increased to $${this.currentAmount}`);
        } else {
            this.showFeedback('Maximum amount reached', 'warning');
        }
    }
    
    /**
     * Decrease donation amount by increment
     */
    decreaseAmount() {
        const newAmount = this.currentAmount - this.options.increment;
        
        if (newAmount >= this.options.minAmount) {
            this.currentAmount = newAmount;
            this.updateDisplay();
            this.notifyHook(`Amount decreased to $${this.currentAmount}`);
        } else {
            this.showFeedback('Minimum amount reached', 'warning');
        }
    }
    
    /**
     * Set specific donation amount
     */
    setAmount(amount) {
        const numericAmount = parseFloat(amount) || this.options.defaultAmount;
        
        if (numericAmount >= this.options.minAmount && numericAmount <= this.options.maxAmount) {
            this.currentAmount = Math.round(numericAmount / this.options.increment) * this.options.increment;
            this.updateDisplay();
            
            this.storeInMemory('amount-set', {
                amount: this.currentAmount,
                previousAmount: amount
            });
            
            this.notifyHook(`Amount set to $${this.currentAmount}`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Update the display with current amount
     */
    updateDisplay() {
        if (this.amountInput) {
            this.amountInput.value = this.currentAmount;
        }
        
        // Update donate button text with amount
        if (this.donateBtn) {
            this.donateBtn.textContent = `Donate Now`;
        }
        
        // Update button states
        this.updateButtonStates();
        
        // Update URL for coordination
        this.updateDonationUrl();
    }
    
    /**
     * Update button states based on current amount
     */
    updateButtonStates() {
        if (this.decreaseBtn) {
            this.decreaseBtn.disabled = this.currentAmount <= this.options.minAmount;
            this.decreaseBtn.style.opacity = this.decreaseBtn.disabled ? '0.5' : '1';
        }
        
        if (this.increaseBtn) {
            this.increaseBtn.disabled = this.currentAmount >= this.options.maxAmount;
            this.increaseBtn.style.opacity = this.increaseBtn.disabled ? '0.5' : '1';
        }
    }
    
    /**
     * Generate donation URL with current amount
     */
    generateDonationUrl() {
        // Build URL with correct format: base?frequency=&amount=XXX
        const baseUrl = this.options.baseUrl;
        const frequency = this.options.urlParams.frequency || '';
        const amount = this.currentAmount.toString();
        
        // Construct URL in the exact format needed
        const donationUrl = `${baseUrl}?frequency=${frequency}&amount=${amount}`;
        
        return donationUrl;
    }
    
    /**
     * Update donation URL and store in memory
     */
    updateDonationUrl() {
        const donationUrl = this.generateDonationUrl();
        
        this.storeInMemory('donation-url', {
            url: donationUrl,
            amount: this.currentAmount,
            timestamp: Date.now()
        });
        
        return donationUrl;
    }
    
    /**
     * Handle donation button click
     */
    handleDonation() {
        const donationUrl = this.generateDonationUrl();
        
        // Show loading state
        this.showLoadingState(true);
        
        // Store donation attempt in memory
        this.storeInMemory('donation-attempt', {
            amount: this.currentAmount,
            url: donationUrl,
            timestamp: Date.now()
        });
        
        this.notifyHook(`Donation initiated for $${this.currentAmount}`);
        
        // Simulate brief loading period then redirect
        setTimeout(() => {
            try {
                // Open in new window/tab
                window.open(donationUrl, '_blank', 'noopener,noreferrer');
                
                // Show success feedback
                this.showFeedback('Redirecting to donation page...', 'success');
                
                this.notifyHook(`Redirected to donation page: ${donationUrl}`);
            } catch (error) {
                console.error('Failed to open donation URL:', error);
                this.showFeedback('Failed to open donation page. Please try again.', 'error');
            } finally {
                this.showLoadingState(false);
            }
        }, 800);
    }
    
    /**
     * Show loading state on donate button
     */
    showLoadingState(isLoading) {
        if (!this.donateBtn) return;
        
        if (isLoading) {
            this.donateBtn.disabled = true;
            this.donateBtn.textContent = 'Processing...';
            this.donateBtn.style.opacity = '0.8';
        } else {
            this.donateBtn.disabled = false;
            this.donateBtn.textContent = `Donate Now`;
            this.donateBtn.style.opacity = '1';
        }
    }
    
    /**
     * Show temporary feedback message
     */
    showFeedback(message, type = 'info') {
        // Create or update feedback element\n        let feedback = this.widget.querySelector('.donation-feedback');\n        \n        if (!feedback) {\n            feedback = document.createElement('div');\n            feedback.className = 'donation-feedback';\n            feedback.style.cssText = `\n                position: absolute;\n                top: -50px;\n                left: 50%;\n                transform: translateX(-50%);\n                padding: 0.5rem 1rem;\n                border-radius: 6px;\n                font-size: 0.9rem;\n                font-weight: 500;\n                white-space: nowrap;\n                z-index: 1000;\n                transition: all 0.3s ease;\n                opacity: 0;\n                pointer-events: none;\n            `;\n            \n            // Make widget container relative for absolute positioning\n            this.widget.style.position = 'relative';\n            this.widget.appendChild(feedback);\n        }\n        \n        // Set message and type-specific styling\n        feedback.textContent = message;\n        \n        const colors = {\n            success: { bg: '#4CAF50', text: '#ffffff' },\n            warning: { bg: '#FF9800', text: '#ffffff' },\n            error: { bg: '#F44336', text: '#ffffff' },\n            info: { bg: '#2196F3', text: '#ffffff' }\n        };\n        \n        const color = colors[type] || colors.info;\n        feedback.style.backgroundColor = color.bg;\n        feedback.style.color = color.text;\n        \n        // Show feedback\n        feedback.style.opacity = '1';\n        \n        // Hide after delay\n        setTimeout(() => {\n            feedback.style.opacity = '0';\n        }, 3000);\n    }\n    \n    /**\n     * Get current donation amount\n     */\n    getCurrentAmount() {\n        return this.currentAmount;\n    }\n    \n    /**\n     * Get current donation URL\n     */\n    getCurrentUrl() {\n        return this.generateDonationUrl();\n    }\n    \n    /**\n     * Reset to default amount\n     */\n    reset() {\n        this.currentAmount = this.options.defaultAmount;\n        this.updateDisplay();\n        this.notifyHook('Widget reset to default amount');\n    }\n    \n    /**\n     * Update widget options\n     */\n    updateOptions(newOptions) {\n        this.options = { ...this.options, ...newOptions };\n        \n        // Validate current amount against new constraints\n        if (this.currentAmount < this.options.minAmount) {\n            this.currentAmount = this.options.minAmount;\n        } else if (this.currentAmount > this.options.maxAmount) {\n            this.currentAmount = this.options.maxAmount;\n        }\n        \n        this.updateDisplay();\n    }\n    \n    /**\n     * Store data in coordination memory\n     */\n    storeInMemory(key, data) {\n        if (typeof window !== 'undefined' && window.localStorage) {\n            try {\n                const memoryKey = `swarm/donation-widget/${key}`;\n                localStorage.setItem(memoryKey, JSON.stringify({\n                    ...data,\n                    timestamp: Date.now()\n                }));\n            } catch (error) {\n                console.warn('Could not store in memory:', error);\n            }\n        }\n    }\n    \n    /**\n     * Notify coordination hook\n     */\n    notifyHook(message) {\n        if (typeof window !== 'undefined') {\n            const event = new CustomEvent('swarm:donation-widget', {\n                detail: {\n                    component: 'donation-widget',\n                    action: 'amount-change',\n                    message: message,\n                    currentAmount: this.currentAmount,\n                    donationUrl: this.generateDonationUrl(),\n                    timestamp: Date.now()\n                }\n            });\n            window.dispatchEvent(event);\n        }\n    }\n    \n    /**\n     * Destroy the widget and clean up resources\n     */\n    destroy() {\n        // Remove event listeners by cloning elements\n        if (this.amountInput) {\n            this.amountInput.replaceWith(this.amountInput.cloneNode(true));\n        }\n        if (this.decreaseBtn) {\n            this.decreaseBtn.replaceWith(this.decreaseBtn.cloneNode(true));\n        }\n        if (this.increaseBtn) {\n            this.increaseBtn.replaceWith(this.increaseBtn.cloneNode(true));\n        }\n        if (this.donateBtn) {\n            this.donateBtn.replaceWith(this.donateBtn.cloneNode(true));\n        }\n        \n        // Remove feedback element if exists\n        const feedback = this.widget.querySelector('.donation-feedback');\n        if (feedback) {\n            feedback.remove();\n        }\n    }\n}\n\n// Export for module use\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = DonationWidget;\n}\n\n// Make available globally\nif (typeof window !== 'undefined') {\n    window.DonationWidget = DonationWidget;\n}"
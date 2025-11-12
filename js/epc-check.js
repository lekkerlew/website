// ===========================
// EPC Landing Page JavaScript
// Elite Energy
// ===========================

// ===========================
// Modal Functions
// ===========================
function openCalculator() {
    const modal = document.getElementById('calculatorModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Analytics tracking (if implemented)
    trackEvent('Calculator', 'Open', 'EPC Requirements Calculator');
}

function closeCalculator() {
    const modal = document.getElementById('calculatorModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form when closing
    document.getElementById('calculatorForm').reset();
    document.getElementById('calculatorResult').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('calculatorModal');
    if (event.target == modal) {
        closeCalculator();
    }
}

// ===========================
// Calculator Form Logic
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('calculatorForm');
    
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                buildingType: document.getElementById('buildingType').value,
                buildingSize: parseInt(document.getElementById('buildingSize').value),
                ownership: document.getElementById('ownership').value,
                transaction: document.getElementById('transaction').value
            };
            
            // Calculate EPC requirement
            const result = calculateEPCRequirement(formData);
            
            // Display result
            displayCalculatorResult(result);
            
            // Track calculator submission
            trackEvent('Calculator', 'Submit', `Type: ${formData.buildingType}, Size: ${formData.buildingSize}`);
        });
    }
});

function calculateEPCRequirement(data) {
    let requiresEPC = false;
    let urgency = 'normal';
    let message = '';
    let recommendations = [];
    
    // EPC requirement logic based on South African regulations
    if (data.buildingType === 'residential') {
        requiresEPC = false;
        message = 'Residential complexes have different requirements';
        recommendations = [
            'Energy efficiency improvements can still provide significant cost savings',
            'Consider voluntary certification for marketing advantages'
        ];
    } else if (data.buildingSize > 100) {
        requiresEPC = true;
        urgency = 'high';
        message = `Your ${data.buildingType} building with ${data.buildingSize}m² floor area falls under mandatory EPC requirements`;
        recommendations = [
            'Register immediately to avoid penalties',
            'Get proof of compliance process',
            'Schedule your energy audit within 30 days'
        ];
        
        // Higher urgency for certain scenarios
        if (data.transaction !== 'none') {
            urgency = 'critical';
            message += '. Your planned transaction requires immediate EPC compliance';
        }
    } else {
        requiresEPC = true;
        urgency = 'medium';
        message = 'Your building may require an EPC based on specific use cases and local regulations';
        recommendations = [
            'Get a professional assessment to confirm requirements',
            'Small buildings may still need EPCs for certain uses'
        ];
    }
    
    return {
        requiresEPC,
        urgency,
        message,
        recommendations,
        data
    };
}

function displayCalculatorResult(result) {
    const resultDiv = document.getElementById('calculatorResult');
    
    // Build result HTML
    let resultHTML = '';
    let resultClass = 'calculator-result ';
    
    if (result.requiresEPC) {
        if (result.urgency === 'critical') {
            resultClass += 'result-yes';
            resultHTML = `
                <h3 style="color: #ff4444;">⚠️ URGENT: Your building REQUIRES an EPC certificate</h3>
                <p style="margin: 15px 0;">${result.message}</p>
                <div style="background: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="font-weight: bold; margin-bottom: 10px;">Immediate Actions Required:</p>
                    <ul style="text-align: left; margin: 10px 20px;">
                        ${result.recommendations.map(rec => `<li style="margin: 5px 0;">${rec}</li>`).join('')}
                    </ul>
                </div>
                <button class="cta-button" style="margin-top: 20px;" onclick="urgentRegistration();">
                    Get Emergency Compliance Support →
                </button>
            `;
        } else if (result.urgency === 'high') {
            resultClass += 'result-yes';
            resultHTML = `
                <h3 style="color: #ff4444;">✓ Your building REQUIRES an EPC certificate</h3>
                <p style="margin: 15px 0;">${result.message}</p>
                <p style="margin-top: 20px;"><strong>Next Steps:</strong></p>
                <ul style="text-align: left; margin: 10px auto; max-width: 400px;">
                    ${result.recommendations.map(rec => `<li style="margin: 5px 0;">${rec}</li>`).join('')}
                </ul>
                <button class="cta-button" style="margin-top: 20px;" onclick="scrollToContact(); closeCalculator();">
                    Register Now →
                </button>
            `;
        } else {
            resultClass += 'result-warning';
            resultHTML = `
                <h3 style="color: #ffc107;">⚠️ Professional Assessment Recommended</h3>
                <p style="margin: 15px 0;">${result.message}</p>
                <ul style="text-align: left; margin: 10px auto; max-width: 400px;">
                    ${result.recommendations.map(rec => `<li style="margin: 5px 0;">${rec}</li>`).join('')}
                </ul>
                <button class="cta-button" style="margin-top: 20px;" onclick="scrollToContact(); closeCalculator();">
                    Get Professional Assessment →
                </button>
            `;
        }
    } else {
        resultClass += 'result-no';
        resultHTML = `
            <h3 style="color: #4CAF50;">✓ ${result.message}</h3>
            <ul style="text-align: left; margin: 20px auto; max-width: 400px;">
                ${result.recommendations.map(rec => `<li style="margin: 5px 0;">${rec}</li>`).join('')}
            </ul>
            <button class="cta-button" style="margin-top: 20px; background: #2196F3;" onclick="scrollToContact(); closeCalculator();">
                Get Free Energy Consultation →
            </button>
        `;
    }
    
    // Display result
    resultDiv.innerHTML = resultHTML;
    resultDiv.className = resultClass;
    resultDiv.style.display = 'block';
    
    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===========================
// Registration Form Handler
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                buildings: document.getElementById('buildings').value,
                urgency: document.getElementById('urgency').value,
                timestamp: new Date().toISOString(),
                source: 'EPC Landing Page'
            };
            
            // Validate form
            if (!validateRegistrationForm(formData)) {
                return false;
            }
            
            // Submit form (replace with actual API endpoint)
            submitRegistration(formData);
        });
    }
});

function validateRegistrationForm(data) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        showError('Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function submitRegistration(formData) {
    // Show loading state
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = 'Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Success handling
        showSuccess('Thank you for registering! We will contact you within 24 hours with your proof of compliance documentation.');
        
        // Reset form
        document.getElementById('registrationForm').reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Track conversion
        trackEvent('Registration', 'Submit', formData.urgency);
        
        // Optional: Redirect to thank you page
        // window.location.href = '/thank-you';
    }, 1000);
    
    // In production, replace with actual API call:
    /*
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showSuccess('Registration successful!');
        document.getElementById('registrationForm').reset();
    })
    .catch(error => {
        showError('An error occurred. Please try again.');
        console.error('Registration error:', error);
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
    */
}

// ===========================
// Utility Functions
// ===========================
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function urgentRegistration() {
    // Set urgency in form
    scrollToContact();
    closeCalculator();
    
    // Pre-select urgent option
    setTimeout(() => {
        const urgencySelect = document.getElementById('urgency');
        if (urgencySelect) {
            urgencySelect.value = 'immediate';
            urgencySelect.style.borderColor = '#ff4444';
            urgencySelect.style.borderWidth = '2px';
        }
    }, 500);
}

function showError(message) {
    // Create or update error message element
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 12px; border-radius: 5px; margin-bottom: 20px;';
    }
    errorDiv.textContent = message;
    
    const form = document.getElementById('registrationForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.style.cssText = 'background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 600px; text-align: center;';
    successDiv.textContent = message;
    
    const contactSection = document.getElementById('contact');
    contactSection.insertBefore(successDiv, contactSection.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 10000);
}

// ===========================
// Countdown Timer
// ===========================
function addUrgencyCountdown() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24));
    
    const urgencyElements = document.querySelectorAll('.limited-offer');
    urgencyElements.forEach(el => {
        if (!el.dataset.countdownAdded) {
            el.innerHTML += ` - Only ${daysLeft} days left this month!`;
            el.dataset.countdownAdded = 'true';
        }
    });
}

// ===========================
// Analytics Tracking
// ===========================
function trackEvent(category, action, label = null) {
    // Google Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Console logging for development
    console.log('Event tracked:', { category, action, label });
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll('.info-card, .benefit-item, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(el);
    });
}

// ===========================
// Exit Intent Popup (Optional)
// ===========================
function initExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            
            // Check if user hasn't filled form
            const email = document.getElementById('email').value;
            if (!email) {
                openCalculator();
                trackEvent('Exit Intent', 'Show', 'Calculator Popup');
            }
        }
    });
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    // Add countdown timer
    addUrgencyCountdown();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize exit intent (optional - uncomment to enable)
    // initExitIntent();
    
    // Add smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Track page view
    trackEvent('Page View', 'Load', 'EPC Landing Page');
});

// ===========================
// Performance Monitoring
// ===========================
window.addEventListener('load', function() {
    // Log page load time
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('Page load time exceeds 3 seconds. Consider optimizing assets.');
        }
    }
});
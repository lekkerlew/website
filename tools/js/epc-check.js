// ===========================
// EPC Landing Page JavaScript
// Elite Energy
// ===========================

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
    const deadline = new Date('2025-12-07');
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
        const urgencyElements = document.querySelectorAll('.limited-offer');
        urgencyElements.forEach(el => {
            if (!el.dataset.countdownAdded) {
                el.innerHTML += ` - Only ${daysLeft} days until deadline!`;
                el.dataset.countdownAdded = 'true';
            }
        });
    }
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
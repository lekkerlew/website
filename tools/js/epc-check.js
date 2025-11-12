// EPC Landing Page JavaScript
// Handles registration form only - calculator handled by navigation.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Wait for navigation.js to load, then setup calculator links
    setTimeout(setupCalculatorLinks, 100);
    
    // Registration Form Handler
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
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
            
            if (validateForm(formData)) {
                submitRegistration(formData);
            }
        });
    }
    
    // Add countdown timer
    addCountdown();
});

function setupCalculatorLinks() {
    const calcLinks = document.querySelectorAll('.calc-loader-link');
    
    calcLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filePath = this.getAttribute('href');
            const targetDivId = this.getAttribute('data-target-div');
            const targetDiv = document.querySelector(targetDivId);
            
            if (targetDiv && filePath) {
                // Use navigation.js function if available
                if (typeof showCalculator === 'function') {
                    showCalculator(targetDiv, filePath);
                } else {
                    // Fallback: manually trigger
                    loadAndShowCalculator(targetDiv, filePath);
                }
            }
        });
    });
}

function loadAndShowCalculator(targetDiv, filePath) {
    if (!targetDiv.innerHTML.trim()) {
        fetch(filePath)
            .then(response => response.text())
            .then(html => {
                targetDiv.innerHTML = html;
                return loadScript('./tools/js/epc-requirements-calculator.js');
            })
            .then(() => {
                targetDiv.classList.add('active');
                if (window.epcCalculator && window.epcCalculator.init) {
                    setTimeout(() => window.epcCalculator.init(), 100);
                }
            });
    } else {
        targetDiv.classList.add('active');
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(data.phone) || data.phone.length < 10) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }
    
    return true;
}

function submitRegistration(formData) {
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = 'Submitting...';
    submitButton.disabled = true;
    
    // Replace with actual API endpoint
    setTimeout(() => {
        showMessage('Thank you for registering! We will contact you within 24 hours with your proof of compliance documentation.', 'success');
        document.getElementById('registrationForm').reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1000);
    
    /* Production API call:
    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Registration successful!', 'success');
        document.getElementById('registrationForm').reset();
    })
    .catch(error => {
        showMessage('An error occurred. Please try again.', 'error');
    })
    .finally(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
    */
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = type === 'error' 
        ? 'background: #f8d7da; color: #721c24; padding: 12px; border-radius: 5px; margin-bottom: 20px;'
        : 'background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px auto; max-width: 600px; text-align: center;';
    messageDiv.textContent = message;
    
    const form = document.getElementById('registrationForm');
    if (type === 'error') {
        form.insertBefore(messageDiv, form.firstChild);
    } else {
        const contactSection = document.getElementById('contact');
        contactSection.insertBefore(messageDiv, contactSection.firstChild);
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    setTimeout(() => messageDiv.remove(), type === 'error' ? 5000 : 10000);
}

function addCountdown() {
    const now = new Date();
    const deadline = new Date('2025-12-07');
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
        const limitedOffer = document.querySelector('.limited-offer');
        if (limitedOffer && !limitedOffer.dataset.countdownAdded) {
            limitedOffer.innerHTML += ` - Only ${daysLeft} days until deadline!`;
            limitedOffer.dataset.countdownAdded = 'true';
        }
    }
}
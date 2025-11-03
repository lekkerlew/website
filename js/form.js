/**
 * form.js - Handle contact form validation and submission
 */

(function() {
    'use strict';

    function initForm() {
        const contactForm = document.getElementById('contactForm');
        const btnSubmit = document.getElementById('btnSubmit');
        
        if (!contactForm || !btnSubmit) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const honeypot = contactForm.querySelector('input[name="website"]').value;
            
            let isValid = true;
            
            // Check honeypot (spam protection)
            if (honeypot) {
                console.log('Spam detected');
                return;
            }
            
            // Validate name
            if (!name) {
                document.getElementById('name').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('name').classList.remove('is-invalid');
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                document.getElementById('email').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('email').classList.remove('is-invalid');
            }
            
            // Validate message
            if (!message) {
                document.getElementById('message').classList.add('is-invalid');
                isValid = false;
            } else {
                document.getElementById('message').classList.remove('is-invalid');
            }
            
            if (!isValid) {
                return;
            }
            
            // Show loading state
            btnSubmit.classList.add('btn-loading');
            btnSubmit.disabled = true;
            
            // Simulate form submission (replace with actual AJAX call to your server)
            setTimeout(() => {
                // In a real implementation, you would send the form data to your server
                // Example using fetch:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ name, email, message })
                // })
                
                console.log('Form submitted:', { name, email, message });
                
                // Show success message
                const successElement = document.getElementById('success');
                if (successElement) {
                    successElement.textContent = 'Thank you for your message! We will get back to you soon.';
                    successElement.classList.add('alert', 'alert-success');
                }
                
                // Reset form
                contactForm.reset();
                
                // Remove loading state
                btnSubmit.classList.remove('btn-loading');
                btnSubmit.disabled = false;
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    if (successElement) {
                        successElement.textContent = '';
                        successElement.classList.remove('alert', 'alert-success');
                    }
                }, 5000);
            }, 1500);
        });

        // Real-time validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!this.value.trim() || !emailRegex.test(this.value)) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }

        if (messageInput) {
            messageInput.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }
    }

    // Initialize when components are loaded
    document.addEventListener('componentsLoaded', initForm);
})();
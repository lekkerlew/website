/**
 * cookies.js - Handle cookie consent banner
 */

(function() {
    'use strict';

    function initCookieConsent() {
        const cookieConsent = document.getElementById('cookieConsent');
        const cookieAccept = document.getElementById('cookieAccept');
        const cookieReject = document.getElementById('cookieReject');
        
        if (!cookieConsent || !cookieAccept || !cookieReject) return;
        
        // Check if user has already made a choice
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieConsent.style.display = 'block';
            }, 1000);
        }
        
        // Accept cookies
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.style.display = 'none';
            
            // Initialize analytics here if needed
            // Example: initAnalytics();
            console.log('Cookies accepted');
        });
        
        // Reject cookies
        cookieReject.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            cookieConsent.style.display = 'none';
            console.log('Cookies rejected');
        });
    }

    // Initialize immediately (doesn't depend on components)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
})();
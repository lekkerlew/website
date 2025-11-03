/**
 * loader.js - Load HTML components dynamically
 */

(function() {
    'use strict';

    // Function to load HTML content
    function loadHTML(elementId, filePath) {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = html;
                } else {
                    console.error(`Element with id '${elementId}' not found`);
                }
            })
            .catch(error => {
                console.error(`Error loading ${filePath}:`, error);
            });
    }

    // Load all components when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        Promise.all([
            loadHTML('header-container', 'header.html'),
            loadHTML('main-container', 'main.html'),
            loadHTML('footer-container', 'footer.html')
        ]).then(() => {
            // Dispatch a custom event when all components are loaded
            document.dispatchEvent(new Event('componentsLoaded'));
        });
    });

    // Register service worker for offline functionality (optional feature)
    // Only attempt registration if service workers are supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(err) {
                    console.debug('ServiceWorker not available or registration failed. This is optional and does not affect site functionality: ', err.message);
                });
        });
    }
})();
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

})();
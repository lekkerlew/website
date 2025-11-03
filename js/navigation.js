/**
 * navigation.js - Handle navbar functionality
 */

(function() {
    'use strict';

    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLogo = document.querySelector('.nav-logo');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (!navbar) return;

        let navbarHeight = navbar.offsetHeight;

        // Update navbarHeight on resize
        window.addEventListener('resize', () => {
            navbarHeight = navbar.offsetHeight;
        });

        // Smooth scroll & mobile collapse
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                
                // Skip if it's an external link or anchor-less
                if (!href || !href.startsWith('#')) return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Close mobile menu
                if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        // Navbar background & logo scale on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > navbarHeight) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });

        // Mobile menu handling
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navbarToggler && navbarCollapse) {
                if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });

        // --- START: CALCULATOR LOGIC ---
        // This logic is now inside initNavigation, so we know the links exist.

        const mainContainer = document.getElementById('main-container');
        const calcContainers = [
            document.getElementById('solar-cost-calc'),
            document.getElementById('epc-requirements-calc')
        ];

        // 1. Listen for Clicks on Calculator Links
        document.querySelectorAll('.calc-loader-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // This is the most important part: prevent default navigation
                e.preventDefault(); 
                e.stopPropagation();

                const url = link.getAttribute('href');
                const targetDivId = link.dataset.targetDiv;
                const targetDiv = document.querySelector(targetDivId);

                if (!targetDiv || !mainContainer) {
                    console.error("Calculator containers or main container not found.");
                    return;
                }
                
                // Hide any other calculators that might be open
                calcContainers.forEach(container => {
                    if (container) {
                        container.style.display = 'none';
                        container.innerHTML = ''; // Clear old content
                    }
                });

                // Load the new content
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(html => {
                        // Create and add the close button
                        const closeButton = '<button type="button" class="calc-close-btn" aria-label="Close" style="position: absolute; top: 15px; right: 20px; font-size: 2.5rem; color: #fff; background: transparent; border: 0; text-shadow: 0 1px 0 #000; opacity: .8; z-index: 10;">&times;</button>';
                        
                        targetDiv.innerHTML = closeButton + html;
                        targetDiv.style.position = 'relative'; // Ensure button is positioned correctly

                        // Hide the main content and show the calculator
                        mainContainer.style.display = 'none';
                        targetDiv.style.display = 'block';

                        // Scroll to the top of the newly loaded calculator
                        targetDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    })
                    .catch(error => {
                        console.error('Error loading calculator:', error);
                        targetDiv.innerHTML = '<p style="color:red; text-align:center; padding: 20px;">Error loading content. Please try again.</p>';
                        targetDiv.style.display = 'block';
                    });
            });
        });

        // 2. Listen for Clicks on "Close" Buttons (using event delegation)
        // This listener is added to the document so it can catch clicks on
        // buttons that are added dynamically.
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calc-close-btn')) {
                
                const calculatorDiv = e.target.closest('#solar-cost-calc, #epc-requirements-calc');
                
                if (calculatorDiv) {
                    calculatorDiv.style.display = 'none';
                    calculatorDiv.innerHTML = ''; // Clear its content
                }
    
                if (mainContainer) {
                    mainContainer.style.display = 'block';
                }
            }
        });
        // --- END: CALCULATOR LOGIC ---
    }
    
    // Initialize when components are loaded
    document.addEventListener('componentsLoaded', initNavigation);
    
})();

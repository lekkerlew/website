/**
 * navigation.js - Handle navbar functionality and calculator visibility
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

        // --- CALCULATOR VISIBILITY LOGIC ---
        const mainContent = document.querySelector('.main');
        const solarCalcDiv = document.getElementById('solar-cost-calc');
        const epcCalcDiv = document.getElementById('epc-requirements-calc');

        // Helper function to hide all other content sections
        function hideAllContent() {
            if (mainContent) {
                // Hide all direct section children except the calculator section
                const sections = mainContent.querySelectorAll('section, div.section');
                sections.forEach(section => {
                    if (section.id !== 'calculator') {
                        section.style.display = 'none';
                    }
                });
            }
        }

        // Helper function to show all other content sections
        function showAllContent() {
            if (mainContent) {
                const sections = mainContent.querySelectorAll('section, div.section');
                sections.forEach(section => {
                    section.style.display = 'block';
                });
            }
        }

        // Helper function to show a specific calculator
        function showCalculator(calcDiv) {
            if (!calcDiv) return;

            // Hide the other calculator
            if (calcDiv === solarCalcDiv && epcCalcDiv) {
                epcCalcDiv.style.display = 'none';
            } else if (calcDiv === epcCalcDiv && solarCalcDiv) {
                solarCalcDiv.style.display = 'none';
            }

            // Show the current calculator
            calcDiv.style.display = 'block';
            hideAllContent();
            
            // Scroll to calculator
            setTimeout(() => {
                calcDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }

        // Helper function to hide all calculators
        function hideAllCalculators() {
            if (solarCalcDiv) solarCalcDiv.style.display = 'none';
            if (epcCalcDiv) epcCalcDiv.style.display = 'none';
            showAllContent();
        }

        // Listen for clicks on calculator dropdown links
        document.querySelectorAll('.calc-loader-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const targetDivId = link.dataset.targetDiv;
                const targetDiv = document.querySelector(targetDivId);

                if (targetDiv) {
                    showCalculator(targetDiv);
                    
                    // Close mobile menu if open
                    if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                        navbarCollapse.classList.remove('show');
                    }
                }
            });
        });

        // Listen for close button clicks on calculators
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calc-close-btn')) {
                hideAllCalculators();
            }
        });
    }
    
    // Initialize when components are loaded
    document.addEventListener('componentsLoaded', initNavigation);
    
})();
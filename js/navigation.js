/**
 * navigation.js - Handle navbar functionality with transparent-to-solid scroll behavior
 */

(function() {
    'use strict';

    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (!navbar) return;

        // Scroll threshold for navbar transformation (80px)
        const scrollThreshold = 80;

        /**
         * Handle navbar scroll behavior - transparent to solid
         */
        function handleNavbarScroll() {
            if (window.scrollY > scrollThreshold) {
                navbar.classList.add('navbar-scrolled');
                navbar.classList.remove('navbar-transparent');
            } else {
                navbar.classList.remove('navbar-scrolled');
                navbar.classList.add('navbar-transparent');
            }
        }

        // Initial check on page load
        handleNavbarScroll();

        // Listen to scroll events with debouncing for performance
        let scrollTimer;
        window.addEventListener('scroll', () => {
            if (scrollTimer) {
                window.cancelAnimationFrame(scrollTimer);
            }
            scrollTimer = window.requestAnimationFrame(() => {
                handleNavbarScroll();
            });
        });

        /**
         * Smooth scroll to anchor links
         */
        navLinks.forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                
                // Skip if it's an external link or anchor-less
                if (!href || !href.startsWith('#')) return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20; // 20px extra padding
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        /**
         * Mobile menu handling
         */
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                navbarCollapse.classList.toggle('show');
            });
        }
        
        /**
         * Close menu when clicking outside
         */
        document.addEventListener('click', (e) => {
            if (navbarToggler && navbarCollapse) {
                if (!navbarToggler.contains(e.target) && 
                    !navbarCollapse.contains(e.target) &&
                    navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });

        /**
         * Active link highlighting based on scroll position
         */
        function updateActiveLink() {
            const sections = document.querySelectorAll('section[id], div[id]');
            const navbarHeight = navbar.offsetHeight;
            const scrollPosition = window.scrollY + navbarHeight + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                    if (activeLink && !activeLink.classList.contains('btn')) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }

        // Update active link on scroll
        window.addEventListener('scroll', updateActiveLink);
        // Initial check
        updateActiveLink();

        // --- CALCULATOR VISIBILITY LOGIC ---
        const mainContent = document.querySelector('.main');
        const solarCalcDiv = document.getElementById('solar-cost-calc');
        const epcCalcDiv = document.getElementById('epc-requirements-calc');

        /**
         * Hide all content sections
         */
        function hideAllContent() {
            if (mainContent) {
                const sections = mainContent.querySelectorAll('section, div.section');
                sections.forEach(section => {
                    if (section.id !== 'calculator') {
                        section.style.display = 'none';
                    }
                });
            }
        }

        /**
         * Show all content sections
         */
        function showAllContent() {
            if (mainContent) {
                const sections = mainContent.querySelectorAll('section, div.section');
                sections.forEach(section => {
                    section.style.display = '';
                });
            }
        }

        /**
         * Show specific calculator
         */
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
            
            // Scroll to calculator with proper offset
            setTimeout(() => {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = calcDiv.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }

        /**
         * Hide all calculators
         */
        function hideAllCalculators() {
            if (solarCalcDiv) solarCalcDiv.style.display = 'none';
            if (epcCalcDiv) epcCalcDiv.style.display = 'none';
            showAllContent();
        }

        /**
         * Handle calculator dropdown link clicks
         */
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
                    
                    // Close dropdown menu
                    const dropdownMenu = link.closest('.dropdown-menu');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                }
            });
        });

        /**
         * Handle calculator close button clicks
         */
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calc-close-btn')) {
                hideAllCalculators();
                
                // Scroll back to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        /**
         * Handle browser back/forward buttons
         */
        window.addEventListener('popstate', function(event) {
            if (window.location.hash) {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Initialize when components are loaded
    document.addEventListener('componentsLoaded', initNavigation);
    
})();
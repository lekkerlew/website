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

        // --- CALCULATOR LOADING AND VISIBILITY LOGIC ---
        const mainContent = document.querySelector('.main');
        const solarCalcDiv = document.getElementById('solar-cost-calc');
        const epcCalcDiv = document.getElementById('epc-requirements-calc');

        /**
         * Load calculator HTML content
         */
        function loadCalculator(filePath, targetDiv) {
            console.log('Loading calculator from:', filePath);
            
            return fetch(filePath)
                .then(response => {
                    console.log('Fetch response:', response.status, response.statusText);
                    if (!response.ok) {
                        throw new Error(`Failed to load calculator: ${response.status} ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log('HTML loaded, length:', html.length);
                    targetDiv.innerHTML = html;
                    console.log(`Calculator loaded successfully: ${filePath}`);
                    
                    // Re-initialize calculator JavaScript after loading HTML
                    if (filePath.includes('solar-savings')) {
                        console.log('Triggering solar calculator initialization');
                        // Solar calculator initializes automatically via its script
                        const event = new Event('solarCalculatorLoaded');
                        document.dispatchEvent(event);
                        
                        // Also try direct initialization if available
                        if (typeof initSolarCalculator === 'function') {
                            setTimeout(initSolarCalculator, 100);
                        }
                    } else if (filePath.includes('epc-requirements')) {
                        console.log('Triggering EPC calculator initialization');
                        // EPC calculator initializes automatically via its script
                        setTimeout(() => {
                            if (window.epcCalculator && window.epcCalculator.init) {
                                window.epcCalculator.init();
                            }
                        }, 100);
                    }
                })
                .catch(error => {
                    console.error(`Error loading calculator from ${filePath}:`, error);
                    targetDiv.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: #dc3545; background: white; border-radius: 8px; margin: 20px;">
                            <h3>Error Loading Calculator</h3>
                            <p>Sorry, we couldn't load the calculator. Please refresh the page and try again.</p>
                            <p style="font-size: 0.9em; color: #6c757d;">Error: ${error.message}</p>
                        </div>
                    `;
                });
        }

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
        function showCalculator(calcDiv, filePath) {
            if (!calcDiv) return;

            // Hide the other calculator
            if (calcDiv === solarCalcDiv && epcCalcDiv) {
                epcCalcDiv.style.display = 'none';
            } else if (calcDiv === epcCalcDiv && solarCalcDiv) {
                solarCalcDiv.style.display = 'none';
            }

            // Load calculator HTML if not already loaded
            if (!calcDiv.innerHTML.trim()) {
                loadCalculator(filePath, calcDiv).then(() => {
                    // Show the calculator after loading
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
                });
            } else {
                // Show the calculator if already loaded
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

                const filePath = link.getAttribute('href');
                const targetDivId = link.getAttribute('data-target-div');
                const targetDiv = document.querySelector(targetDivId);

                console.log('Calculator link clicked:', { filePath, targetDivId, targetDiv });

                if (targetDiv && filePath) {
                    showCalculator(targetDiv, filePath);
                    
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
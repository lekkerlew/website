/**
 * navigation.js - Handle navbar functionality with transparent-to-solid scroll behavior
 */

(function() {
    'use strict';

    function initNavigation() {
        console.log('=== Navigation Initialization Started ===');
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        console.log('Navigation elements:', { navbar, navLinks: navLinks.length, navbarToggler, navbarCollapse });

        if (!navbar) {
            console.error('Navbar not found!');
            return;
        }

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
        console.log('Setting up calculator logic...');
        
        // Function to get calculator elements (may not be in DOM immediately)
        function getCalculatorElements() {
            return {
                mainContent: document.querySelector('.main'),
                solarCalcDiv: document.getElementById('solar-cost-calc'),
                epcCalcDiv: document.getElementById('epc-requirements-calc')
            };
        }
        
        // Function to ensure calculator divs exist in DOM
        function ensureCalculatorDivsExist() {
            let solarDiv = document.getElementById('solar-cost-calc');
            let epcDiv = document.getElementById('epc-requirements-calc');
            
            if (!solarDiv) {
                console.warn('Creating missing #solar-cost-calc div');
                solarDiv = document.createElement('div');
                solarDiv.id = 'solar-cost-calc';
                solarDiv.style.display = 'none'; // Changed from 'hidden' to 'none'
                document.body.appendChild(solarDiv);
            }
            
            if (!epcDiv) {
                console.warn('Creating missing #epc-requirements-calc div');
                epcDiv = document.createElement('div');
                epcDiv.id = 'epc-requirements-calc';
                epcDiv.style.display = 'none'; // Changed from 'hidden' to 'none'
                document.body.appendChild(epcDiv);
            }
            
            return { solarDiv, epcDiv };
        }
        
        // Ensure divs exist
        ensureCalculatorDivsExist();
        
        let calcElements = getCalculatorElements();
        console.log('Calculator elements:', {
            mainContent: calcElements.mainContent ? 'found' : 'NOT FOUND',
            solarCalcDiv: calcElements.solarCalcDiv ? 'found' : 'NOT FOUND',
            epcCalcDiv: calcElements.epcCalcDiv ? 'found' : 'NOT FOUND'
        });
        
        // If elements still not found after creation attempt, retry
        if (!calcElements.solarCalcDiv || !calcElements.epcCalcDiv) {
            console.warn('Calculator divs not found after creation attempt, will retry in 500ms...');
            setTimeout(() => {
                ensureCalculatorDivsExist();
                calcElements = getCalculatorElements();
                console.log('Retry - Calculator elements:', {
                    mainContent: calcElements.mainContent ? 'found' : 'NOT FOUND',
                    solarCalcDiv: calcElements.solarCalcDiv ? 'found' : 'NOT FOUND',
                    epcCalcDiv: calcElements.epcCalcDiv ? 'found' : 'NOT FOUND'
                });
            }, 500);
        }

        /**
         * Load calculator JavaScript file dynamically
         */
        function loadCalculatorScript(scriptPath) {
            return new Promise((resolve, reject) => {
                // Check if script already loaded
                const existing = document.querySelector(`script[src="${scriptPath}"]`);
                if (existing) {
                    console.log('Script already loaded:', scriptPath);
                    resolve();
                    return;
                }
                
                console.log('Loading script:', scriptPath);
                const script = document.createElement('script');
                script.src = scriptPath;
                script.onload = () => {
                    console.log('Script loaded successfully:', scriptPath);
                    resolve();
                };
                script.onerror = () => {
                    console.error('Failed to load script:', scriptPath);
                    reject(new Error(`Failed to load ${scriptPath}`));
                };
                document.body.appendChild(script);
            });
        }

        /**
         * Load calculator HTML content
         */
        function loadCalculator(filePath, targetDiv) {
            console.log(`Loading calculator from: ${filePath}`);
            
            // Determine which JS file to load
            let scriptPath = '';
            if (filePath.includes('solar-savings')) {
                scriptPath = './tools/js/solar-savings-calculator.js';
            } else if (filePath.includes('epc-requirements')) {
                scriptPath = './tools/js/epc-requirements-calculator.js';
            }
            
            return fetch(filePath)
                .then(response => {
                    console.log('Fetch response:', response.status, response.statusText);
                    if (!response.ok) {
                        throw new Error(`Failed to load calculator: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log(`HTML loaded, length: ${html.length} characters`);
                    targetDiv.innerHTML = html;
                    console.log('HTML injected into div');
                    
                    // Load the calculator JavaScript file
                    if (scriptPath) {
                        console.log('Loading calculator script...');
                        return loadCalculatorScript(scriptPath);
                    }
                })
                .then(() => {
                    console.log('Calculator ready for initialization');
                    
                    // Wait a bit for script to execute, then initialize
                    return new Promise(resolve => setTimeout(resolve, 300));
                })
                .then(() => {
                    // Re-initialize calculator after script loads
                    if (filePath.includes('solar-savings')) {
                        console.log('Initializing solar calculator...');
                        const province = document.getElementById('province');
                        console.log('Solar calc province element:', !!province);
                        
                        if (typeof initSolarCalculator === 'function') {
                            console.log('Calling initSolarCalculator()');
                            initSolarCalculator();
                        } else {
                            console.log('initSolarCalculator not defined, script should auto-init');
                        }
                    } else if (filePath.includes('epc-requirements')) {
                        console.log('Initializing EPC calculator...');
                        const epcContainer = document.getElementById('epc-question-container');
                        console.log('EPC container exists:', !!epcContainer);
                        
                        if (epcContainer) {
                            console.log('Container found! Calling epcCalculator.init()');
                            if (window.epcCalculator && window.epcCalculator.init) {
                                window.epcCalculator.init();
                            } else {
                                console.error('epcCalculator.init not available after script load');
                            }
                        } else {
                            console.error('EPC container still not found after HTML injection');
                        }
                    }
                })
                .catch(error => {
                    console.error(`Error loading calculator:`, error);
                    targetDiv.innerHTML = `
                        <div style="padding: 40px; text-align: center; color: #dc3545; background: white; border-radius: 8px; margin: 20px;">
                            <h3>Error Loading Calculator</h3>
                            <p>Sorry, we couldn't load the calculator. Please refresh the page and try again.</p>
                            <p style="font-size: 0.9em; color: #666;">Error: ${error.message}</p>
                        </div>
                    `;
                });
        }

        /**
         * Show specific calculator as modal overlay
         */
        function showCalculator(calcDiv, filePath) {
            if (!calcDiv) {
                console.error('Calculator div is null!');
                return;
            }

            console.log('showCalculator called for:', calcDiv.id);

            // Get fresh references to calculator elements
            const elements = getCalculatorElements();
            
            // Hide the other calculator
            if (calcDiv === elements.solarCalcDiv && elements.epcCalcDiv) {
                console.log('Hiding EPC calculator');
                elements.epcCalcDiv.classList.remove('active');
            } else if (calcDiv === elements.epcCalcDiv && elements.solarCalcDiv) {
                console.log('Hiding Solar calculator');
                elements.solarCalcDiv.classList.remove('active');
            }

            // Load calculator HTML if not already loaded
            if (!calcDiv.innerHTML.trim()) {
                console.log('Calculator div is empty, loading HTML...');
                loadCalculator(filePath, calcDiv).then(() => {
                    // Show the calculator modal after loading
                    console.log('Adding active class to:', calcDiv.id);
                    calcDiv.classList.add('active');
                    
                    // Scroll modal to top
                    calcDiv.scrollTop = 0;
                });
            } else {
                console.log('Calculator already loaded, showing modal...');
                // Show the calculator modal
                calcDiv.classList.add('active');
                
                // Scroll modal to top
                calcDiv.scrollTop = 0;
            }
        }

        /**
         * Hide all calculators (close modals)
         */
        function hideAllCalculators() {
            const elements = getCalculatorElements();
            if (elements.solarCalcDiv) {
                console.log('Removing active class from solar calc');
                elements.solarCalcDiv.classList.remove('active');
            }
            if (elements.epcCalcDiv) {
                console.log('Removing active class from EPC calc');
                elements.epcCalcDiv.classList.remove('active');
            }
        }

        /**
         * Handle calculator dropdown link clicks
         */
        function setupCalculatorLinks() {
            console.log('Setting up calculator link handlers...');
            const calcLinks = document.querySelectorAll('.calc-loader-link');
            console.log('Found calculator links:', calcLinks.length);
            
            if (calcLinks.length === 0) {
                console.warn('No calculator links found yet, will retry...');
                return false;
            }
            
            calcLinks.forEach((link, index) => {
                console.log(`Calculator link ${index + 1}:`, {
                    href: link.getAttribute('href'),
                    targetDiv: link.getAttribute('data-target-div'),
                    text: link.textContent.trim()
                });
                
                link.addEventListener('click', (e) => {
                    console.log('Calculator link clicked!');
                    e.preventDefault();
                    e.stopPropagation();

                    const filePath = link.getAttribute('href');
                    const targetDivId = link.getAttribute('data-target-div');
                    const targetDiv = document.querySelector(targetDivId);

                    console.log('Click details:', { filePath, targetDivId, targetDiv });

                    if (targetDiv && filePath) {
                        console.log('Showing calculator...');
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
                    } else {
                        console.error('Missing required elements:', { targetDiv, filePath });
                    }
                });
            });
            
            return true;
        }
        
        // Try to setup links immediately
        if (!setupCalculatorLinks()) {
            // If links not found, retry after a delay
            console.log('Retrying calculator link setup in 500ms...');
            setTimeout(setupCalculatorLinks, 500);
        }

        /**
         * Handle calculator close button clicks
         */
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('calc-close-btn')) {
                console.log('Close button clicked');
                hideAllCalculators();
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
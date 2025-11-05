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
         * Hide all content sections
         */
        function hideAllContent() {
            const elements = getCalculatorElements();
            console.log('hideAllContent - main content element:', elements.mainContent ? 'found' : 'NOT FOUND');
            if (elements.mainContent) {
                console.log('Hiding main content, current display:', elements.mainContent.style.display);
                elements.mainContent.style.display = 'none';
                console.log('Main content hidden, new display:', elements.mainContent.style.display);
            }
        }

        /**
         * Show all content sections
         */
        function showAllContent() {
            const elements = getCalculatorElements();
            if (elements.mainContent) {
                elements.mainContent.style.display = '';
            }
        }

        /**
         * Show specific calculator
         */
        function showCalculator(calcDiv, filePath) {
            if (!calcDiv) {
                console.error('Calculator div is null!');
                return;
            }

            console.log('showCalculator called for:', calcDiv.id);
            console.log('Current display:', calcDiv.style.display);
            console.log('Computed display:', window.getComputedStyle(calcDiv).display);
            console.log('Has content:', calcDiv.innerHTML.length > 0);

            // Get fresh references to calculator elements
            const elements = getCalculatorElements();
            
            // Hide the other calculator
            if (calcDiv === elements.solarCalcDiv && elements.epcCalcDiv) {
                console.log('Hiding EPC calculator');
                elements.epcCalcDiv.style.display = 'none';
            } else if (calcDiv === elements.epcCalcDiv && elements.solarCalcDiv) {
                console.log('Hiding Solar calculator');
                elements.solarCalcDiv.style.display = 'none';
            }

            // Load calculator HTML if not already loaded
            if (!calcDiv.innerHTML.trim()) {
                console.log('Calculator div is empty, loading HTML...');
                loadCalculator(filePath, calcDiv).then(() => {
                    // Show the calculator after loading
                    console.log('Setting display to block for:', calcDiv.id);
                    
                    // Remove the style attribute entirely, then set display
                    calcDiv.removeAttribute('style');
                    calcDiv.style.display = 'block';
                    
                    // Also try setAttribute as backup
                    calcDiv.setAttribute('style', 'display: block !important;');
                    
                    console.log('After setting - style attr:', calcDiv.getAttribute('style'));
                    console.log('After setting - style.display:', calcDiv.style.display);
                    console.log('After setting - computed:', window.getComputedStyle(calcDiv).display);
                    
                    hideAllContent();
                    
                    // Scroll to calculator with proper offset
                    setTimeout(() => {
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = calcDiv.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = targetPosition - navbarHeight - 20;
                        
                        console.log('Scrolling to calculator, offset:', offsetPosition);
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                });
            } else {
                console.log('Calculator already loaded, just showing it...');
                // Show the calculator if already loaded
                console.log('Setting display to block for:', calcDiv.id);
                console.log('BEFORE - style attr:', calcDiv.getAttribute('style'));
                console.log('BEFORE - style.display:', calcDiv.style.display);
                
                // Remove the style attribute entirely, then set display
                calcDiv.removeAttribute('style');
                calcDiv.style.display = 'block';
                
                // Also try setAttribute as backup
                calcDiv.setAttribute('style', 'display: block !important;');
                
                console.log('AFTER - style attr:', calcDiv.getAttribute('style'));
                console.log('AFTER - style.display:', calcDiv.style.display);
                console.log('AFTER - computed:', window.getComputedStyle(calcDiv).display);
                console.log('Hiding main content...');
                hideAllContent();
                
                // Scroll to calculator with proper offset
                setTimeout(() => {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = calcDiv.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = targetPosition - navbarHeight - 20;
                    
                    console.log('Scrolling to calculator, offset:', offsetPosition);
                    console.log('Calc div top:', calcDiv.getBoundingClientRect().top);
                    console.log('Page Y offset:', window.pageYOffset);
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
            const elements = getCalculatorElements();
            if (elements.solarCalcDiv) elements.solarCalcDiv.style.display = 'none';
            if (elements.epcCalcDiv) elements.epcCalcDiv.style.display = 'none';
            showAllContent();
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

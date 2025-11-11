/**
 * Gallery Navigation and Lightbox Functionality
 * Elite Energy Solutions
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    /**
     * Main initialization function
     */
    function initGallery() {
        const galleries = document.querySelectorAll('.gallery-scroll-container');
        
        if (galleries.length === 0) {
            // Content might be loading dynamically, retry once
            setTimeout(() => {
                const retriedGalleries = document.querySelectorAll('.gallery-scroll-container');
                if (retriedGalleries.length > 0) {
                    initScrollNavigation();
                    initLightbox();
                }
            }, 500);
        } else {
            initScrollNavigation();
            initLightbox();
        }
    }

    /**
     * Initialize horizontal scroll navigation for galleries
     */
    function initScrollNavigation() {
        const galleries = document.querySelectorAll('.gallery-scroll-container');
        
        galleries.forEach((container) => {
            const wrapper = container.querySelector('.gallery-scroll-wrapper');
            const prevBtn = container.querySelector('.gallery-nav-btn.prev');
            const nextBtn = container.querySelector('.gallery-nav-btn.next');
            
            if (!wrapper || !prevBtn || !nextBtn) return;

            // Ensure buttons don't trigger form submissions
            prevBtn.setAttribute('type', 'button');
            nextBtn.setAttribute('type', 'button');

            // Scroll amount (width of one item + gap)
            const scrollAmount = 340;

            // Previous button click handler
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                wrapper.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Next button click handler
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                wrapper.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Update button states based on scroll position
            function updateButtons() {
                const scrollLeft = wrapper.scrollLeft;
                const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

                // Disable/enable previous button
                if (scrollLeft <= 0) {
                    prevBtn.disabled = true;
                    prevBtn.style.opacity = '0.3';
                } else {
                    prevBtn.disabled = false;
                    prevBtn.style.opacity = '1';
                }

                // Disable/enable next button
                if (scrollLeft >= maxScroll - 1) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.3';
                } else {
                    nextBtn.disabled = false;
                    nextBtn.style.opacity = '1';
                }
            }

            // Update button states on scroll
            wrapper.addEventListener('scroll', updateButtons);
            
            // Set initial button states
            updateButtons();

            // Update button states on window resize
            window.addEventListener('resize', updateButtons);
        });
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        // Create or get lightbox modal
        let lightboxModal = document.querySelector('.lightbox-modal');
        
        if (!lightboxModal) {
            lightboxModal = createLightboxModal();
            document.body.appendChild(lightboxModal);
        }

        const lightboxImage = lightboxModal.querySelector('.lightbox-image');
        const lightboxClose = lightboxModal.querySelector('.lightbox-close');
        const lightboxPrev = lightboxModal.querySelector('.lightbox-nav-btn.prev');
        const lightboxNext = lightboxModal.querySelector('.lightbox-nav-btn.next');
        const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
        const lightboxCounter = lightboxModal.querySelector('.lightbox-counter');

        let currentImageIndex = 0;
        let currentGalleryImages = [];

        // Add click handler to all gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                const container = item.closest('.gallery-scroll-wrapper');
                currentGalleryImages = Array.from(container.querySelectorAll('.gallery-item img'));
                currentImageIndex = currentGalleryImages.indexOf(item.querySelector('img'));
                showLightbox(currentImageIndex);
            });
        });

        // Close lightbox handlers
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
                closeLightbox();
            }
        });

        // Navigation handlers
        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            showLightbox(currentImageIndex);
        });

        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            showLightbox(currentImageIndex);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightboxModal.style.display !== 'block') return;
            
            if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                showLightbox(currentImageIndex);
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
                showLightbox(currentImageIndex);
            }
        });

        /**
         * Show lightbox with image at specified index
         */
        function showLightbox(index) {
            const img = currentGalleryImages[index];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            
            // Get caption from overlay or alt text
            const overlay = img.parentElement.querySelector('.gallery-item-overlay');
            const caption = overlay ? overlay.querySelector('.gallery-item-title').textContent : img.alt;
            lightboxCaption.textContent = caption;
            
            // Update counter
            lightboxCounter.textContent = `${index + 1} / ${currentGalleryImages.length}`;
            
            // Show modal and prevent body scroll
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        /**
         * Close lightbox and restore body scroll
         */
        function closeLightbox() {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Create lightbox modal HTML structure
     */
    function createLightboxModal() {
        const modal = document.createElement('div');
        modal.className = 'lightbox-modal';
        modal.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <div class="lightbox-counter">1 / 1</div>
            <div class="lightbox-content">
                <button type="button" class="lightbox-nav-btn prev" aria-label="Previous">&#10094;</button>
                <img class="lightbox-image" src="" alt="">
                <button type="button" class="lightbox-nav-btn next" aria-label="Next">&#10095;</button>
            </div>
            <div class="lightbox-caption"></div>
        `;
        return modal;
    }

})();

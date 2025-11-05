/**
 * Gallery Navigation and Lightbox Functionality
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    function initGallery() {
        console.log('Initializing gallery...');
        initScrollNavigation();
        initLightbox();
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
            
            if (!wrapper || !prevBtn || !nextBtn) {
                console.warn('Gallery elements not found', container);
                return;
            }

            // Scroll amount (width of one item + gap)
            const scrollAmount = 340; // 320px item + 20px gap

            // Previous button click
            prevBtn.addEventListener('click', () => {
                wrapper.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Next button click
            nextBtn.addEventListener('click', () => {
                wrapper.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            // Update button states based on scroll position
            function updateButtons() {
                const scrollLeft = wrapper.scrollLeft;
                const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

                // Disable prev button at start
                if (scrollLeft <= 0) {
                    prevBtn.disabled = true;
                } else {
                    prevBtn.disabled = false;
                }

                // Disable next button at end
                if (scrollLeft >= maxScroll - 1) { // -1 for rounding
                    nextBtn.disabled = true;
                } else {
                    nextBtn.disabled = false;
                }
            }

            // Update buttons on scroll
            wrapper.addEventListener('scroll', updateButtons);
            
            // Initial button state
            updateButtons();

            // Update on window resize
            window.addEventListener('resize', updateButtons);
        });

        console.log('Gallery scroll navigation initialized');
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        // Create lightbox modal if it doesn't exist
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

        // Get all gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentImageIndex = 0;
        let currentGalleryImages = [];

        // Add click handler to all gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Get all images from the same gallery
                const container = item.closest('.gallery-scroll-wrapper');
                currentGalleryImages = Array.from(container.querySelectorAll('.gallery-item img'));
                currentImageIndex = currentGalleryImages.indexOf(item.querySelector('img'));
                
                showLightbox(currentImageIndex);
            });
        });

        // Close lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close on background click
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
                closeLightbox();
            }
        });

        // Previous image
        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            showLightbox(currentImageIndex);
        });

        // Next image
        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            showLightbox(currentImageIndex);
        });

        // Arrow keys navigation
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
            
            // Show modal
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        }

        function closeLightbox() {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore body scroll
        }

        console.log('Lightbox initialized');
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
                <button class="lightbox-nav-btn prev" aria-label="Previous">&#10094;</button>
                <img class="lightbox-image" src="" alt="">
                <button class="lightbox-nav-btn next" aria-label="Next">&#10095;</button>
            </div>
            <div class="lightbox-caption"></div>
        `;
        return modal;
    }

})();

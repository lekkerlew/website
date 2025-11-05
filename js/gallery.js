/**
 * gallery.js - Handle image gallery and lightbox
 */

(function() {
    'use strict';

    function initGallery() {
        const images = document.querySelectorAll('.gallery-img');
        const modalImage = document.getElementById('modalImage');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!images.length || !modalImage) return;

        let currentIndex = 0;
        let currentGroup = '';
        let groupImages = [];
        let modal;

        // Image click handler
        images.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentGroup = img.dataset.group;
                groupImages = Array.from(document.querySelectorAll(`.gallery-img[data-group="${currentGroup}"]`));
                currentIndex = groupImages.indexOf(img);
                showImage();
                
                // Initialize Bootstrap modal
                const modalElement = document.getElementById('imageModal');
                if (modalElement && typeof bootstrap !== 'undefined') {
                    modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
            });
        });

        // Show current image
        function showImage() {
            if (groupImages[currentIndex]) {
                modalImage.src = groupImages[currentIndex].src;
            }
        }

        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + groupImages.length) % groupImages.length;
                showImage();
            });
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % groupImages.length;
                showImage();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const modalElement = document.getElementById('imageModal');
            if (!modalElement || !modalElement.classList.contains('show')) return;
            
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + groupImages.length) % groupImages.length;
                showImage();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % groupImages.length;
                showImage();
            } else if (e.key === 'Escape' && modal) {
                modal.hide();
            }
        });
    }

    // Initialize when components are loaded
    document.addEventListener('componentsLoaded', initGallery);
})();

// Enhanced Lightbox functionality with better navigation
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    let images = [];
    let isAnimating = false;

    // Initialize lightbox with all gallery images
    function initializeLightbox() {
        images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            caption: item.querySelector('.gallery-overlay span').textContent
        }));
    }

    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add loading state
        lightboxImg.classList.add('loading');
        lightboxImg.classList.remove('loaded');
        
        // Preload next and previous images for smoother navigation
        preloadAdjacentImages();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        isAnimating = false;
    }

    // Update lightbox content with smooth transition
    function updateLightbox() {
        if (isAnimating) return;
        
        isAnimating = true;
        const image = images[currentIndex];
        
        // Add loading state
        lightboxImg.classList.add('loading');
        lightboxImg.classList.remove('loaded');
        
        // Update image source
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxCaption.textContent = image.caption;
        
        // Wait for image to load
        lightboxImg.onload = function() {
            lightboxImg.classList.remove('loading');
            lightboxImg.classList.add('loaded');
            isAnimating = false;
        };
        
        // Handle image load errors
        lightboxImg.onerror = function() {
            lightboxImg.classList.remove('loading');
            lightboxImg.classList.add('loaded');
            isAnimating = false;
        };
        
        // Update button states
        updateNavigationButtons();
    }

    // Navigate to next image
    function nextImage() {
        if (isAnimating) return;
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
        preloadAdjacentImages();
    }

    // Navigate to previous image
    function prevImage() {
        if (isAnimating) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
        preloadAdjacentImages();
    }

    // Preload adjacent images for smoother navigation
    function preloadAdjacentImages() {
        const nextIndex = (currentIndex + 1) % images.length;
        const prevIndex = (currentIndex - 1 + images.length) % images.length;
        
        const nextImage = new Image();
        nextImage.src = images[nextIndex].src;
        
        const prevImage = new Image();
        prevImage.src = images[prevIndex].src;
    }

    // Update navigation button states
    function updateNavigationButtons() {
        // Show/hide buttons based on image count
        if (images.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    // Event listeners for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });

        // Add keyboard accessibility
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowUp':
                // Optional: zoom in or other functionality
                break;
            case 'ArrowDown':
                // Optional: zoom out or other functionality
                break;
        }
    });

    // Close lightbox when clicking on backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Enhanced swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    lightbox.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling while swiping
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const xDiff = touchStartX - touchEndX;
        const yDiff = touchStartY - touchEndY;

        // Check if it's a horizontal swipe (not vertical scroll)
        if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > swipeThreshold) {
            if (xDiff > 0) {
                nextImage(); // Swipe left
            } else {
                prevImage(); // Swipe right
            }
        }
    }

    // Prevent image dragging
    lightboxImg.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Initialize lightbox
    initializeLightbox();

    // Make functions globally available for the inline script
    window.initializeLightbox = initializeLightbox;
    window.updateNavigationButtons = updateNavigationButtons;
});
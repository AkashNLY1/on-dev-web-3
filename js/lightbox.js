// Lightbox functionality for gallery
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxCaption = document.getElementById('lightbox-caption');
        this.lightboxClose = document.getElementById('lightbox-close');
        this.lightboxPrev = document.getElementById('lightbox-prev');
        this.lightboxNext = document.getElementById('lightbox-next');
        
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.setupGalleryItems();
        this.setupEventListeners();
    }
    
    setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-overlay span');
            
            if (img) {
                this.images.push({
                    src: img.src,
                    alt: img.alt,
                    caption: caption ? caption.textContent : ''
                });
                
                item.addEventListener('click', () => {
                    this.openLightbox(index);
                });
            }
        });
    }
    
    setupEventListeners() {
        // Close lightbox
        if (this.lightboxClose) {
            this.lightboxClose.addEventListener('click', () => {
                this.closeLightbox();
            });
        }
        
        // Previous image
        if (this.lightboxPrev) {
            this.lightboxPrev.addEventListener('click', () => {
                this.showPreviousImage();
            });
        }
        
        // Next image
        if (this.lightboxNext) {
            this.lightboxNext.addEventListener('click', () => {
                this.showNextImage();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    this.showPreviousImage();
                } else if (e.key === 'ArrowRight') {
                    this.showNextImage();
                }
            }
        });
        
        // Close on backdrop click
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }
    
    openLightbox(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.updateLightboxContent();
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    showPreviousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxContent();
    }
    
    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxContent();
    }
    
    updateLightboxContent() {
        const image = this.images[this.currentIndex];
        
        if (this.lightboxImg) {
            this.lightboxImg.src = image.src;
            this.lightboxImg.alt = image.alt;
        }
        
        if (this.lightboxCaption) {
            this.lightboxCaption.textContent = image.caption;
        }
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Lightbox();
});
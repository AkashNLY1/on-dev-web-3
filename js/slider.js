// Enhanced Hero Slider with additional controls
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.isPaused = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.startSlideShow();
        this.setupEventListeners();
        this.showSlide(0);
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current slide
        this.slides[index].classList.add('active');
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
        this.currentSlide = index;
    }
    
    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) next = 0;
        this.showSlide(next);
    }
    
    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) prev = this.slides.length - 1;
        this.showSlide(prev);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
            this.restartSlideShow();
        }
    }
    
    startSlideShow() {
        this.slideInterval = setInterval(() => {
            if (!this.isPaused) {
                this.nextSlide();
            }
        }, 5000);
    }
    
    pauseSlideShow() {
        this.isPaused = true;
    }
    
    resumeSlideShow() {
        this.isPaused = false;
    }
    
    restartSlideShow() {
        clearInterval(this.slideInterval);
        this.startSlideShow();
    }
    
    setupEventListeners() {
        // Indicator click events
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                this.pauseSlideShow();
            });
            
            heroSection.addEventListener('mouseleave', () => {
                this.resumeSlideShow();
            });
        }
        
        // Touch swipe support
        this.setupTouchEvents();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.restartSlideShow();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.restartSlideShow();
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        heroSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
            this.restartSlideShow();
        }
    }
    
    destroy() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HeroSlider();
});
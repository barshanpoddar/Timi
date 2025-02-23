document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const skipBtn = document.querySelector('.skip-btn');
    const nextBtns = document.querySelectorAll('.next-btn');
    const startBtn = document.querySelector('.start-btn');
    
    // Initialize state variables
    let currentSlide = 0;
    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;
    let autoSlideTimer = null;
    let userInteracted = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let startTime = 0;
    let isDragging = true;

    // Function to update dimensions and layout
    function updateDimensions() {
        deviceWidth = window.innerWidth;
        deviceHeight = window.innerHeight;
        
        // Update container dimensions
        slider.style.width = Math.min(deviceWidth, 420) + 'px';
        slider.style.height = deviceHeight + 'px';
        
        // Update slides dimensions
        slides.forEach(slide => {
            let slider = slide.style.width = Math.min(deviceWidth, 420) + 'px';
            slide.style.height = deviceHeight + 'px';
        });
        
        // Update current slide position
        goToSlide(currentSlide, false);
    }

    // Function to update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Function to go to specific slide
    function goToSlide(index, animate = true) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        currentSlide = index;
        const offset = -currentSlide * Math.min(deviceWidth, 420);
        
        slider.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
        slider.style.transform = `translateX(${offset}px)`;
        
        updateDots();
    }

    // Function to start auto-sliding
    function startAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        autoSlideTimer = setInterval(() => {
            if (!userInteracted && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (!userInteracted && currentSlide === slides.length - 1) {
                clearInterval(autoSlideTimer);
                window.location.href = 'sync.html';
            }
        }, 3000);
    }

    // Function to stop auto-sliding
    function stopAutoSlide() {
        if (autoSlideTimer) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    // Handle user interaction
    function handleUserInteraction() {
        userInteracted = true;
        stopAutoSlide();
    }

    // Next button click handlers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleUserInteraction();
            goToSlide(currentSlide + 1);
        });
    });

    // Skip button click handler
    skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleUserInteraction();
        window.location.href = 'sync.html';
    });

    // Start button click handler
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleUserInteraction();
        window.location.href = 'sync.html';
    });

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            handleUserInteraction();
            goToSlide(index);
        });
    });

    // Touch event handlers
    slider.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return; // Ignore multi-touch
        handleUserInteraction();
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        startTime = Date.now();
        slider.style.transition = 'none';
        e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length > 1) return;
        
        const touch = e.touches[0];
        const diff = touch.clientX - touchStartX;
        const offset = -currentSlide * Math.min(deviceWidth, 420) + diff;
        
        // Add resistance at the edges
        if (currentSlide === 0 && diff > 0 || 
            currentSlide === slides.length - 1 && diff < 0) {
            slider.style.transform = `translateX(${offset / 3}px)`;
        } else {
            slider.style.transform = `translateX(${offset}px)`;
        }
        
        e.preventDefault();
    }, { passive: false });

    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const touch = e.changedTouches[0];
        touchEndX = touch.clientX;
        
        const diff = touchEndX - touchStartX;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(diff) / duration;
        
        slider.style.transition = 'transform 0.3s ease-out';
        
        if (Math.abs(diff) > 50 || velocity > 0.5) {
            if (diff > 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            } else if (diff < 0 && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide);
            }
        } else {
            goToSlide(currentSlide);
        }
        
        touchStartX = 0;
        touchEndX = 0;
        e.preventDefault();
    }, { passive: false });

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);

    // Handle back button
    window.addEventListener('popstate', () => {
        if (history.state?.slide !== undefined) {
            goToSlide(history.state.slide, false);
        }
    });

    // Prevent default behavior
    function preventDefault(e) {
        e.preventDefault();
    }

    // Disable pull-to-refresh
    document.body.addEventListener('touchmove', preventDefault, { passive: false });

    // Initial setup
    updateDimensions();
    startAutoSlide();
});

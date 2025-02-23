document.addEventListener('DOMContentLoaded', () => {
    // Add history state for splash screen
    history.replaceState({ screen: 'splash' }, '', '');

    // Get device dimensions
    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;

    // Function to update dimensions and layout
    function updateDimensions() {
        deviceWidth = window.innerWidth;
        deviceHeight = window.innerHeight;
        
        // Update container dimensions
        const container = document.querySelector('.splash-container');
        container.style.width = Math.min(deviceWidth, 420) + 'px';
        container.style.height = deviceHeight + 'px';
        
        // Update logo size based on device width
        const logo = document.querySelector('.logo');
        if (logo) {
            const logoSize = Math.min(deviceWidth * 0.4, 180); // 40% of width up to 180px
            logo.style.width = logoSize + 'px';
        }
    }

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);

    // Initial setup
    updateDimensions();

    // Preload intro page
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'intro.html';
    document.head.appendChild(link);

    // Ensure image is loaded before starting animation
    const logo = document.querySelector('.logo');
    
    function startTransition() {
        setTimeout(() => {
            document.querySelector('.splash-container').style.opacity = '0';
            setTimeout(() => {
                // Push state for intro page before navigating
                history.pushState({ screen: 'intro' }, '', 'intro.html');
                window.location.replace('intro.html');
            }, 500);
        }, 2500);
    }

    if (logo.complete) {
        startTransition();
    } else {
        logo.onload = startTransition;
    }

    // Handle back button
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.screen === 'splash') {
            // Stay on splash screen if back button is pressed
            history.pushState({ screen: 'splash' }, '', '');
        }
    });
});

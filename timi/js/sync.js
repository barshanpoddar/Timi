document.addEventListener('DOMContentLoaded', () => {
    // Get device dimensions
    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;

    // Function to update dimensions and layout
    function updateDimensions() {
        deviceWidth = window.innerWidth;
        deviceHeight = window.innerHeight;
        
        // Update container dimensions
        const container = document.querySelector('.container');
        container.style.width = Math.min(deviceWidth, 420) + 'px';
        container.style.minHeight = deviceHeight + 'px';
    }

    // Update dimensions on resize
    window.addEventListener('resize', updateDimensions);

    // Initial setup
    updateDimensions();

    // Handle button clicks
    const googleBtn = document.querySelector('.google-btn');
    const emailBtn = document.querySelector('.email-btn');
    const guestBtn = document.querySelector('.guest-btn');

    googleBtn.addEventListener('click', () => {
        // Handle Google sign in
        window.location.href = 'index.html';
    });

    emailBtn.addEventListener('click', () => {
        // Handle email sign in
        window.location.href = 'index.html';
    });

    guestBtn.addEventListener('click', () => {
        // Handle guest mode
        window.location.href = 'index.html';
    });

    // Handle back navigation
    window.addEventListener('popstate', () => {
        if (history.state?.screen === 'intro') {
            window.location.reload();
        }
    });
});

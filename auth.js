// Simple password protection for the prototype
(function() {
    const CORRECT_PASSWORD = 'storeview2026'; // Change this to your desired password
    const AUTH_KEY = 'storeview_authenticated';

    // Check if already authenticated in this session
    if (sessionStorage.getItem(AUTH_KEY) === 'true') {
        return; // Already authenticated, allow access
    }

    // Hide page content initially
    document.documentElement.style.visibility = 'hidden';

    // Check authentication on page load
    function checkAuth() {
        const password = prompt('This prototype is password protected.\n\nPlease enter the password to continue:');

        if (password === null) {
            // User clicked cancel
            document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #666;">Access denied. Please refresh to try again.</div>';
            document.documentElement.style.visibility = 'visible';
            return;
        }

        if (password === CORRECT_PASSWORD) {
            // Correct password
            sessionStorage.setItem(AUTH_KEY, 'true');
            document.documentElement.style.visibility = 'visible';
        } else {
            // Wrong password
            alert('Incorrect password. Please try again.');
            checkAuth(); // Prompt again
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAuth);
    } else {
        checkAuth();
    }
})();

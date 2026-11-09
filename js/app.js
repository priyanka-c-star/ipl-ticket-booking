// ==========================================
// 1. Reusable Toast Notification Function
// ==========================================
function showToast(message) {
    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    // Style the toast using JavaScript (so you don't have to edit your CSS file)
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = '#0a192f'; // Dark blue
    toast.style.color = '#d4af37'; // Gold
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.zIndex = '9999';
    toast.style.fontWeight = 'bold';
    toast.style.transition = 'opacity 0.5s ease';

    // Add it to the page
    document.body.appendChild(toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500); // Wait for fade out to finish
    }, 3000);
}

// ==========================================
// 2. Smooth Scrolling for "Book" Buttons
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Select all buttons inside the match schedule table
    const bookButtons = document.querySelectorAll('#matches table button');

    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Stop the default jump
            
            // Find the booking section
            const bookingSection = document.getElementById('book-ticket');
            
            if (bookingSection) {
                // Smooth scroll to the form
                bookingSection.scrollIntoView({ behavior: 'smooth' });
                
                // Show the toast notification
                showToast('📢 Redirecting to Booking Form...');
            } else {
                // If we are on booking.html, maybe just show a toast
                showToast('📢 Please fill out the form below.');
            }
        });
    });
});
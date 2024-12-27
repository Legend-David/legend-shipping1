
    // Check and initialize cart count from localStorage
    window.onload = function () {
        const storedCartCount = localStorage.getItem('cartCount');
        const cartCountElement = document.getElementById('cartCount');
        if (storedCartCount) {
            cartCountElement.innerText = storedCartCount;
        } else {
            localStorage.setItem('cartCount', '0');
        }
    };

    // Add to cart function
    function addToCart() {
        const cartCountElement = document.getElementById('cartCount');
        let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
        cartCount += 1; // Increment cart count
        cartCountElement.innerText = cartCount; // Update on the page
        localStorage.setItem('cartCount', cartCount.toString()); // Save in localStorage
    }

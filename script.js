// E-commerce Application State
let cart = JSON.parse(localStorage.getItem('nexaShopCart')) || [];
let currentCategory = 'all';

// Product Database
const products = [
    { 
        id: 1, 
        name: "Wireless Headphones", 
        category: "electronics", 
        price: 89.99, 
        oldPrice: 129.99, 
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life.", 
        rating: 4.5, 
        image: 'headphones.jpg', 
        featured: true, 
        badge: "Bestseller" 
    },
    { 
        id: 2, 
        name: "Smart Watch", 
        category: "electronics", 
        price: 199.99, 
        oldPrice: 249.99, 
        description: "Fitness tracker with heart rate monitor and GPS.", 
        rating: 4.3, 
        image: 'smartwatch.jpg', 
        featured: true, 
        badge: "Sale" 
    },
    { 
        id: 3, 
        name: "Laptop Backpack", 
        category: "fashion", 
        price: 49.99, 
        description: "Water-resistant backpack with laptop compartment and USB charging port.", 
        rating: 4.7, 
        image: 'laptopbackpak.jpg', 
        featured: true 
    },
    { 
        id: 4, 
        name: "Coffee Maker", 
        category: "home", 
        price: 79.99, 
        description: "Programmable coffee maker with thermal carafe and auto-shutoff.", 
        rating: 4.4, 
        image: 'coffeemaker.jpg', 
        featured: true, 
        badge: "New" 
    },
    { 
        id: 5, 
        name: "Yoga Mat", 
        category: "sports", 
        price: 29.99, 
        description: "Eco-friendly non-slip yoga mat with carrying strap.", 
        rating: 4.6, 
        image: 'yogamat.jpg', 
        featured: false 
    },
    { 
        id: 6, 
        name: "Novels", 
        category: "books", 
        price: 14.99, 
        description: "Bestselling fiction about technology and human connection.", 
        rating: 4.8, 
        image: 'book.jpg', 
        featured: false 
    },
    { 
        id: 7, 
        name: "Bluetooth Speaker", 
        category: "electronics", 
        price: 59.99, 
        description: "Portable waterproof speaker with 360° sound.", 
        rating: 4.2, 
        image: 'speaker.jpg', 
        featured: false 
    },
    { 
        id: 8, 
        name: "Running Shoes", 
        category: "sports", 
        price: 89.99, 
        oldPrice: 119.99, 
        description: "Lightweight running shoes with cushioning technology.", 
        rating: 4.5, 
        image: 'shoes.jpg', 
        featured: false, 
        badge: "Sale" 
    },
    { 
        id: 9, 
        name: "Desk Lamp", 
        category: "home", 
        price: 34.99, 
        description: "LED desk lamp with adjustable brightness and color temperature.", 
        rating: 4.3, 
        image: 'lamp.jpg', 
        featured: false 
    },
    { 
        id: 10, 
        name: "Graphic T-Shirt", 
        category: "fashion", 
        price: 24.99, 
        description: "100% cotton t-shirt with unique graphic design.", 
        rating: 4.7, 
        image: 'tshirt.jpg', 
        featured: false 
    },
    { 
        id: 11, 
        name: "Cookbook", 
        category: "books", 
        price: 22.99, 
        description: "Healthy recipes with beautiful photography.", 
        rating: 4.9, 
        image: 'cookbook.jpg', 
        featured: false 
    },
    { 
        id: 12, 
        name: "Phone Case", 
        category: "electronics", 
        price: 19.99, 
        description: "Protective case with shock-absorbing technology.", 
        rating: 4.1, 
        image: 'phonecase.jpg', 
        featured: false 
    }
];

// Image path configuration
const IMAGE_BASE_PATH = 'images/';
const PLACEHOLDER_IMAGE = 'placeholder.jpg';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav a, .logo, .footer-column a[data-page], .cart-icon');
const cartCount = document.getElementById('cartCount');
const cartCountNav = document.getElementById('cartCountNav');
const featuredProductsGrid = document.getElementById('featuredProducts');
const allProductsGrid = document.getElementById('allProducts');
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartDiv = document.getElementById('emptyCart');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryButtons = document.querySelectorAll('.category-btn');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutTotal = document.getElementById('checkoutTotal');
const orderSuccessModal = document.getElementById('orderSuccessModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const contactForm = document.getElementById('contactForm');

// Function to get image path with error handling
function getImagePath(imageName) {
    return IMAGE_BASE_PATH + imageName;
}

// Function to create image element with error handling
function createProductImage(imageName, altText) {
    const img = document.createElement('img');
    img.src = getImagePath(imageName);
    img.alt = altText;
    img.loading = 'lazy';
    img.onerror = function() {
        this.src = getImagePath(PLACEHOLDER_IMAGE);
        console.warn(`Image ${imageName} not found, using placeholder`);
    };
    return img;
}

// Initialize the application
function init() {
    // Set up event listeners
    themeToggle.addEventListener('click', toggleTheme);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    checkoutBtn.addEventListener('click', goToCheckout);
    closeOrderModal.addEventListener('click', closeModal);
    continueShoppingBtn.addEventListener('click', closeModalAndGoToShop);
    checkoutForm.addEventListener('submit', placeOrder);
    contactForm.addEventListener('submit', handleContactSubmit);


    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            showPage('shop');
        });
    }
    
    
    // Set up navigation
    navLinks.forEach(link => {
        if (link.hasAttribute('data-page')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                showPage(pageId);
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
            });
        }
    });
    
    // Set up category filter buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const category = button.getAttribute('data-category');
            currentCategory = category;
            
            // Update products grid based on current page
            if (document.getElementById('shop').classList.contains('active')) {
                renderProducts(allProductsGrid, category === 'all' ? products : products.filter(p => p.category === category));
            } else if (document.getElementById('home').classList.contains('active')) {
                renderProducts(featuredProductsGrid, products.filter(p => p.featured));
            }
        });
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Load initial data
    updateCartDisplay();
    renderProducts(featuredProductsGrid, products.filter(p => p.featured));
    renderProducts(allProductsGrid, products);
    
    // Show home page by default
    showPage('home');
}

// Toggle between dark and light mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Show specific page and hide others
function showPage(pageId) {
    // Update active navigation link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Show selected page
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
            
            // Update specific page content
            if (pageId === 'cart') {
                renderCart();
            } else if (pageId === 'checkout') {
                renderCheckoutSummary();
            }
        }
    });
    
    // Update page title
    const pageTitles = {
        'home': 'NexaShop | Modern E-Commerce',
        'shop': 'NexaShop | Shop',
        'cart': 'NexaShop | Shopping Cart',
        'checkout': 'NexaShop | Checkout',
        'about': 'NexaShop | About Us',
        'contact': 'NexaShop | Contact'
    };
    
    document.title = pageTitles[pageId] || 'NexaShop';
    
    // Update category display if needed
    if (pageId === 'shop' || pageId === 'home') {
        const category = currentCategory;
        if (pageId === 'shop') {
            renderProducts(allProductsGrid, category === 'all' ? products : products.filter(p => p.category === category));
        } else if (pageId === 'home') {
            renderProducts(featuredProductsGrid, products.filter(p => p.featured));
        }
    }
}

// Render products to a grid
function renderProducts(container, productsToRender) {
    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = '<div class="card" style="text-align: center; padding: 2rem; grid-column: 1 / -1;"><p>No products found in this category.</p></div>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'card product-card';
        
        // Create product image
        const productImage = createProductImage(product.image, product.name);
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    ${getStarRating(product.rating)}
                    <span style="color: var(--text-light); margin-left: 0.5rem;">${product.rating}</span>
                </div>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    $${product.price.toFixed(2)}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small btn-block add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
                <button class="btn btn-secondary btn-small quick-view-btn" data-id="${product.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
        
        // Insert the image into the product image container
        const imageContainer = productCard.querySelector('.product-image');
        imageContainer.insertBefore(productImage, imageContainer.firstChild);
        
        container.appendChild(productCard);
    });
    
    // Add event listeners to product buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.getAttribute('data-id'))));
    });
    
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', () => quickViewProduct(parseInt(btn.getAttribute('data-id'))));
    });
}

// Get star rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCountNav.textContent = `(${totalItems})`;
    
    // Save to localStorage
    localStorage.setItem('nexaShopCart', JSON.stringify(cart));
}

// Render cart items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block';
        checkoutBtn.disabled = true;
        updateCartSummary(0, 5.99, 0);
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    checkoutBtn.disabled = false;
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'card cart-item';
        
        // Create image for cart item
        const cartImage = createProductImage(item.image, item.name);
        cartImage.style.width = '100px';
        cartImage.style.height = '100px';
        cartImage.style.objectFit = 'cover';
        cartImage.style.borderRadius = '8px';
        
        cartItem.innerHTML = `
            <div class="cart-item-image-container"></div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn increase-btn" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="btn btn-error btn-small remove-btn" data-id="${item.id}" style="margin-left: 1rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div style="font-weight: 700; font-size: 1.25rem;">
                $${itemTotal.toFixed(2)}
            </div>
        `;
        
        // Insert the image into the cart item
        const imageContainer = cartItem.querySelector('.cart-item-image-container');
        imageContainer.appendChild(cartImage);
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Calculate tax (8%) and total
    const tax = subtotal * 0.08;
    const shipping = 5.99;
    const total = subtotal + tax + shipping;
    
    updateCartSummary(subtotal, shipping, tax, total);
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-id')), -1));
    });
    
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-id')), 1));
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                updateQuantity(parseInt(e.target.getAttribute('data-id')), 0, newQuantity);
            }
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.getAttribute('data-id'))));
    });
}

// Update cart summary
function updateCartSummary(subtotal, shipping, tax, total = null) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    shippingEl.textContent = `$${shipping.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    
    if (total !== null) {
        totalEl.textContent = `$${total.toFixed(2)}`;
    } else {
        const calculatedTotal = subtotal + shipping + tax;
        totalEl.textContent = `$${calculatedTotal.toFixed(2)}`;
    }
}

// Update item quantity in cart
function updateQuantity(productId, change, newQuantity = null) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (newQuantity !== null) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart[itemIndex].quantity += change;
        }
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            showNotification('Item removed from cart', 'success');
        }
        
        updateCartDisplay();
        renderCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCart();
    showNotification('Item removed from cart', 'success');
}

// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    showPage('checkout');
}

// Render checkout summary
function renderCheckoutSummary() {
    checkoutSummary.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-row';
        summaryItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        checkoutSummary.appendChild(summaryItem);
    });
    
    // Calculate tax (8%) and total
    const tax = subtotal * 0.08;
    const shipping = 5.99;
    const total = subtotal + tax + shipping;
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Place order
function placeOrder(e) {
    e.preventDefault();
    
    // Validate form
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    
    if (!firstName || !lastName || !email || !address) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Generate order ID
    const orderId = 'NX-' + Date.now().toString().slice(-8);
    document.getElementById('orderId').textContent = orderId;
    
    // Show success modal
    orderSuccessModal.classList.add('active');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Reset form
    checkoutForm.reset();
}

// Close modal
function closeModal() {
    orderSuccessModal.classList.remove('active');
}

// Close modal and go to shop
function closeModalAndGoToShop() {
    closeModal();
    showPage('shop');
}

// Quick view product (simulated)
function quickViewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`Viewing: ${product.name} - $${product.price.toFixed(2)}`, 'success');
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const contactName = document.getElementById('contactName').value;
    
    // In a real application, you would send this data to a server
    showNotification(`Thank you, ${contactName}! Your message has been sent. We'll respond within 24 hours.`, 'success');
    
    // Reset form
    contactForm.reset();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const bgColor = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
    
    notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background-color: ${bgColor}; color: white; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: var(--shadow); z-index: 1200; display: flex; align-items: center; gap: 0.75rem; animation: slideInRight 0.3s ease;">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Add CSS for animation if not already present
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
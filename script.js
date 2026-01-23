// ===== Product Data =====
const products = [
    {
        id: 1,
        name: "Wool Overcoat",
        merchant: "London Tailors",
        price: 165,
        category: "outerwear",
        match: "98%",
        badge: "Trending"
    },
    {
        id: 2,
        name: "Cashmere Sweater",
        merchant: "Nordic Knits",
        price: 125,
        category: "outerwear",
        match: "95%",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Silk Midi Dress",
        merchant: "Elegant Threads",
        price: 189,
        category: "dresses",
        match: "92%",
        badge: "New"
    },
    {
        id: 4,
        name: "Leather Tote Bag",
        merchant: "Craft & Co",
        price: 145,
        category: "accessories",
        match: "96%",
        badge: "Top Rated"
    },
    {
        id: 5,
        name: "Linen Blazer",
        merchant: "Summer Threads",
        price: 175,
        category: "outerwear",
        match: "94%",
        badge: "Sustainable"
    },
    {
        id: 6,
        name: "Evening Gown",
        merchant: "Couture House",
        price: 299,
        category: "dresses",
        match: "89%",
        badge: "Luxury"
    },
    {
        id: 7,
        name: "Gold Pendant",
        merchant: "Fine Jewelry Co",
        price: 220,
        category: "accessories",
        match: "91%",
        badge: "Handmade"
    },
    {
        id: 8,
        name: "Trench Coat",
        merchant: "Classic Wear",
        price: 195,
        category: "outerwear",
        match: "97%",
        badge: "Classic"
    },
    {
        id: 9,
        name: "Summer Dress",
        merchant: "Floral Designs",
        price: 89,
        category: "dresses",
        match: "93%",
        badge: "Sale"
    },
    {
        id: 10,
        name: "Leather Belt",
        merchant: "Accessories Plus",
        price: 65,
        category: "accessories",
        match: "88%",
        badge: "Best Seller"
    },
    {
        id: 11,
        name: "Puffer Jacket",
        merchant: "Urban Wear",
        price: 155,
        category: "outerwear",
        match: "90%",
        badge: "Warm"
    },
    {
        id: 12,
        name: "Cocktail Dress",
        merchant: "Party Perfect",
        price: 149,
        category: "dresses",
        match: "94%",
        badge: "Party"
    }
];

// ===== State Management =====
let currentCategory = 'all';
let maxPrice = 200;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    initializeFilters();
    initializeForms();
    initializePriceSlider();
    addSmoothScrolling();
});

// ===== Product Rendering =====
function initializeProducts() {
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filteredProducts = products.filter(product => {
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-secondary);">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style="margin: 0 auto 1rem;">
                    <circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="2"/>
                    <path d="M32 20V36M32 44V44.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3 style="margin-bottom: 0.5rem;">No products found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-merchant">${product.merchant}</p>
                <div class="product-footer">
                    <span class="product-price">£${product.price}</span>
                    <span class="product-match">${product.match} match</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add animation
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// ===== Filter Controls =====
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update category
            currentCategory = this.getAttribute('data-category');
            
            // Re-render products
            renderProducts();
        });
    });
}

// ===== Price Slider =====
function initializePriceSlider() {
    const slider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    slider.addEventListener('input', function() {
        maxPrice = parseInt(this.value);
        priceValue.textContent = `£${maxPrice}`;
    });
    
    slider.addEventListener('change', function() {
        renderProducts();
    });
}

// ===== Form Handling =====
function initializeForms() {
    const customerForm = document.getElementById('customer-form');
    const merchantForm = document.getElementById('merchant-form');
    
    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'customer');
    });
    
    merchantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'merchant');
    });
}

function handleFormSubmission(form, type) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // In a real application, you would send this to a server
    console.log(`${type} form submitted:`, data);
    
    // Show success modal
    showSuccessModal(type);
    
    // Reset form
    form.reset();
}

function showSuccessModal(type) {
    const modal = document.getElementById('success-modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    
    if (type === 'customer') {
        title.textContent = "Welcome to SnapShop!";
        message.textContent = "We'll notify you when we launch. Get ready for a smarter way to shop!";
    } else {
        title.textContent = "Application Received!";
        message.textContent = "Our team will review your application and get back to you within 48 hours.";
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('success-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// ===== Smooth Scrolling =====
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== Navbar Scroll Effect =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== Add to Window for HTML onclick handlers =====
window.scrollToSection = scrollToSection;
window.closeModal = closeModal;

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section-how, .section-ai, .section-products, .section-merchants, .section-contact');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});

// ===== Enhanced Product Card Interactions =====
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for products to render
    setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', function() {
                // Add a subtle animation on click
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px)';
                }, 100);
            });
        });
    }, 500);
});

// ===== Console Easter Egg =====
console.log('%cSnapShop 🛍️', 'font-size: 24px; font-weight: bold; color: #9B8878;');
console.log('%cPowered by AI Intelligence', 'font-size: 14px; color: #B8AFA4;');
console.log('%cBuilt at Imperial College Business School', 'font-size: 12px; color: #3A3732;');
console.log('\n💡 Interested in how this works? Check out our source code!\n');

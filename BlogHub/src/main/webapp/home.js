// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    const searchInput = document.getElementById('searchInput');
    const searchCategories = document.getElementById('searchCategories');
    const filters = document.querySelectorAll('.filter');
    const logoutButton = document.getElementById('logoutButton');
    const categoryItems = document.querySelectorAll('.category-item');
    const newsletterForm = document.querySelector('.newsletter-form');
    const footerSubscribeForm = document.querySelector('.footer-section.subscribe form');
    
    // Initialize username display from localStorage or set default
    const usernameDisplay = document.getElementById('username-display');
    if (localStorage.getItem('username')) {
        usernameDisplay.textContent = localStorage.getItem('username');
    } else {
        usernameDisplay.textContent = 'Guest User';
    }
    
    // Animated scroll for smooth transitions
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Profile dropdown toggle
    profileIcon.addEventListener('click', function() {
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.style.display = 'none';
        }
        
        if (!searchInput.contains(e.target) && !searchCategories.contains(e.target)) {
            searchCategories.style.display = 'none';
        }
    });
    
    // Search input focus/blur
    searchInput.addEventListener('focus', function() {
        searchCategories.style.display = 'block';
    });
    
    // Filter functionality for sidebar
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            filters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            const filterType = this.textContent.toLowerCase();
            const items = document.querySelectorAll('.item');
            
            items.forEach(item => {
                const itemCategory = item.querySelector('.item-category');
                if (filterType === 'all' || itemCategory.textContent.toLowerCase() === filterType) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Add click animations to category items
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Navigate to category page (simulated)
            const categoryName = this.querySelector('h3').textContent;
            console.log(`Navigating to ${categoryName} category`);
            // In real implementation, would navigate to: window.location.href = `category.html?name=${categoryName.toLowerCase()}`;
        });
    });
    
    // Article hover effects
    const contentBoxes = document.querySelectorAll('.content-box, .featured-article');
    contentBoxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Newsletter form submission handler
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (validateEmail(emailInput.value)) {
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Thank you for subscribing!</p>
            `;
            successMessage.style.color = 'white';
            successMessage.style.padding = '10px';
            successMessage.style.marginTop = '10px';
            successMessage.style.display = 'flex';
            successMessage.style.alignItems = 'center';
            successMessage.style.justifyContent = 'center';
            successMessage.style.gap = '10px';
            successMessage.style.animation = 'fadeIn 0.5s ease';
            
            // Replace form with success message
            this.style.display = 'none';
            this.parentNode.appendChild(successMessage);
            
            // Reset and show form after 5 seconds
            setTimeout(() => {
                emailInput.value = '';
                successMessage.remove();
                this.style.display = 'flex';
            }, 5000);
        } else {
            // Shake animation for invalid email
            emailInput.style.animation = 'shake 0.5s ease';
            emailInput.style.borderColor = '#ff6a40';
            
            setTimeout(() => {
                emailInput.style.animation = '';
                emailInput.style.borderColor = '';
            }, 500);
        }
    });
    
    // Footer subscribe form submission handler
    footerSubscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (validateEmail(emailInput.value)) {
            // Show success message
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            button.style.backgroundColor = '#1abc9c';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
                emailInput.value = '';
            }, 3000);
        } else {
            // Indicate invalid email
            emailInput.style.borderColor = '#ff6a40';
            emailInput.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                emailInput.style.borderColor = '';
                emailInput.style.animation = '';
            }, 500);
        }
    });
    
    // Logout button handler - UPDATED
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear user data from localStorage
        localStorage.removeItem('username');
        
        // Show logout animation
        const logoutOverlay = document.createElement('div');
        logoutOverlay.style.position = 'fixed';
        logoutOverlay.style.top = '0';
        logoutOverlay.style.left = '0';
        logoutOverlay.style.width = '100%';
        logoutOverlay.style.height = '100%';
        logoutOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        logoutOverlay.style.zIndex = '9999';
        logoutOverlay.style.display = 'flex';
        logoutOverlay.style.alignItems = 'center';
        logoutOverlay.style.justifyContent = 'center';
        logoutOverlay.style.color = 'white';
        logoutOverlay.style.fontSize = '1.5rem';
        logoutOverlay.style.animation = 'fadeIn 0.3s ease';
        
        logoutOverlay.innerHTML = `
            <div style="text-align: center;">
                <i class="fas fa-sign-out-alt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Logging out...</p>
            </div>
        `;
        
        document.body.appendChild(logoutOverlay);
        
        // Redirect after short delay to login page
        setTimeout(() => {
            // Redirect to login page
            window.location.href = 'login.html';
        }, 2000);
    });
    
    // Create typing animation for hero banner
    createTypingAnimation();
    
    // Add parallax scrolling effect to hero banner
    window.addEventListener('scroll', function() {
        const scroll = window.pageYOffset;
        const heroBanner = document.querySelector('.hero-banner');
        
        if (heroBanner) {
            heroBanner.style.backgroundPositionY = `${scroll * 0.5}px`;
        }
    });
    
    // Show elements on scroll
    const elementsToAnimate = document.querySelectorAll('.box, .category-item, .newsletter-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.15 });
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
    
    // Add custom style element for animations
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(styleEl);
});

// Validate email function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function to create typing animation for hero banner
function createTypingAnimation() {
    const heroHeading = document.querySelector('.hero-content h2');
    if (!heroHeading) return;
    
    const text = heroHeading.textContent;
    heroHeading.innerHTML = '';
    heroHeading.style.display = 'inline-block';
    
    // Create wrapper for cursor effect
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    const textSpan = document.createElement('span');
    textSpan.style.borderRight = '0.15em solid #ff7b54';
    textSpan.style.animation = 'typing 2s steps(30, end) forwards, blink 0.8s infinite';
    textSpan.style.whiteSpace = 'nowrap';
    textSpan.style.overflow = 'hidden';
    textSpan.style.maxWidth = '100%';
    
    // Add typing animation style
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        @keyframes blink {
            0%, 100% { border-color: transparent; }
            50% { border-color: #ff7b54; }
        }
    `;
    document.head.appendChild(styleEl);
    
    // Add content character by character with delay
    let i = 0;
    const typeCharacter = () => {
        if (i < text.length) {
            textSpan.textContent += text.charAt(i);
            i++;
            setTimeout(typeCharacter, 75);
        }
    };
    
    // Start the typing animation
    wrapper.appendChild(textSpan);
    heroHeading.parentNode.replaceChild(wrapper, heroHeading);
    typeCharacter();
}

// Create interactive particles background for hero banner
function createParticlesBackground() {
    const heroBanner = document.querySelector('.hero-banner');
    if (!heroBanner) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = heroBanner.offsetWidth;
    canvas.height = heroBanner.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    
    heroBanner.insertBefore(canvas, heroBanner.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    // Particles array
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Move particles
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Connect particles close to each other
            particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - distance/1000})`;
                    ctx.stroke();
                }
            });
        });
    }
    
    // Start animation
    animate();
    
    // Resize canvas when window resizes
    window.addEventListener('resize', () => {
        canvas.width = heroBanner.offsetWidth;
        canvas.height = heroBanner.offsetHeight;
    });
}

// Initialize particles background after a short delay
setTimeout(createParticlesBackground, 1000);
// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Scroll Animation for Elements
    const elementsToAnimate = document.querySelectorAll('[data-aos]');
    
    function checkVisibility() {
        elementsToAnimate.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                const delay = element.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, delay);
            }
        });
    }
    
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check on initial load
    
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    
    function startCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = 0;
            const increment = target / 50; // Adjust speed
            
            const updateCounter = () => {
                count += increment;
                counter.innerText = Math.min(Math.floor(count), target);
                
                if (count < target) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            const counterSection = counter.closest('section');
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            
            observer.observe(counterSection);
        });
    }
    
    startCounters();
    
    // Testimonial Slider
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (testimonialTrack && testimonials.length > 0) {
        let currentIndex = 0;
        const testimonialWidth = testimonials[0].offsetWidth + parseInt(window.getComputedStyle(testimonials[0]).marginLeft) * 2;
        
        // Set initial position
        testimonialTrack.style.transform = `translateX(0px)`;
        
        // Update active dot
        function updateDots() {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Go to slide
        function goToSlide(index) {
            currentIndex = index;
            testimonialTrack.style.transform = `translateX(-${currentIndex * testimonialWidth}px)`;
            updateDots();
        }
        
        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % testimonials.length;
            goToSlide(currentIndex);
        }
        
        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            goToSlide(currentIndex);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Auto slide (can be enabled or disabled)
        const autoSlideInterval = 5000; // 5 seconds
        let slideInterval = setInterval(nextSlide, autoSlideInterval);
        
        // Pause auto slide on hover
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialTrack.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, autoSlideInterval);
        });
    }
    
    // Blog Type Demo Interaction
    const typeBtns = document.querySelectorAll('.type-btn');
    const recItems = document.querySelectorAll('.rec-item');
    const mockupTitle = document.querySelector('.mockup-title');
    const mockupImage = document.querySelector('.mockup-image');
    const progressBars = document.querySelectorAll('.progress');
    const progressValues = document.querySelectorAll('.metric span');
    
    const blogTypes = {
        travel: {
            title: "10 Must-Visit Destinations in 2025",
            recommendations: ["travel", "travel", "food"],
            engagement: 72,
            retention: 83
        },
        tech: {
            title: "The Future of AI in Daily Life",
            recommendations: ["tech", "tech", "travel"],
            engagement: 85,
            retention: 79
        },
        food: {
            title: "Ultimate Guide to Mediterranean Cuisine",
            recommendations: ["food", "food", "travel"],
            engagement: 78,
            retention: 88
        }
    };
    
    function updateDemoContent(type) {
        if (mockupTitle) mockupTitle.textContent = blogTypes[type].title;
        
        recItems.forEach((item, index) => {
            item.classList.toggle('active', item.getAttribute('data-topic') === blogTypes[type].recommendations[index]);
        });
        
        // Update metrics with animation
        progressBars[0].style.width = `${blogTypes[type].engagement}%`;
        progressValues[0].textContent = `${blogTypes[type].engagement}%`;
        
        progressBars[1].style.width = `${blogTypes[type].retention}%`;
        progressValues[1].textContent = `${blogTypes[type].retention}%`;
    }
    
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            
            // Update active button
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            updateDemoContent(type);
        });
    });
    
    // Initialize demo with first type
    if (typeBtns.length > 0) {
        const initialType = typeBtns[0].getAttribute('data-type');
        updateDemoContent(initialType);
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Engagement Chart (using Chart.js if available)
    const chartCanvas = document.getElementById('engagementChart');
    
    if (chartCanvas && typeof Chart !== 'undefined') {
        const ctx = chartCanvas.getContext('2d');
        
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
        gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
        gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [
                    {
                        label: 'Without AI Recommendations',
                        data: [25, 27, 28, 26, 29, 30],
                        borderColor: '#94a3b8',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'With AI Recommendations',
                        data: [25, 38, 45, 55, 62, 75],
                        borderColor: '#6366f1',
                        backgroundColor: gradientFill,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Avg. Time on Site (minutes)'
                        }
                    }
                }
            }
        });
    } else {
        // Fallback for when Chart.js is not available
        if (chartCanvas) {
            const chartContainer = chartCanvas.parentNode;
            chartContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #64748b;">
                    <p>Enhanced engagement visualization available in the live demo</p>
                    <div style="margin-top: 1rem; height: 200px; background: linear-gradient(45deg, #eef2ff, #f8fafc); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <div style="width: 80%; height: 80%; position: relative;">
                            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 30%; background: rgba(99, 102, 241, 0.1); border-top-left-radius: 8px; border-top-right-radius: 8px;"></div>
                            <div style="position: absolute; bottom: 0; left: 10%; width: 80%; height: 70%; background: rgba(99, 102, 241, 0.2); border-top-left-radius: 8px; border-top-right-radius: 8px;"></div>
                            <div style="position: absolute; bottom: 0; left: 20%; width: 60%; height: 90%; background: rgba(99, 102, 241, 0.3); border-top-left-radius: 8px; border-top-right-radius: 8px;"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && validateEmail(email)) {
                // Show success message
                const successMessage = document.createElement('p');
                successMessage.textContent = 'Thanks for subscribing!';
                successMessage.style.color = '#10b981';
                successMessage.style.marginTop = '0.5rem';
                
                // Remove any existing message
                const existingMessage = newsletterForm.querySelector('.form-message');
                if (existingMessage) {
                    newsletterForm.removeChild(existingMessage);
                }
                
                successMessage.classList.add('form-message');
                newsletterForm.appendChild(successMessage);
                
                // Clear input
                emailInput.value = '';
            } else {
                // Show error message
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Please enter a valid email address.';
                errorMessage.style.color = '#ef4444';
                errorMessage.style.marginTop = '0.5rem';
                
                // Remove any existing message
                const existingMessage = newsletterForm.querySelector('.form-message');
                if (existingMessage) {
                    newsletterForm.removeChild(existingMessage);
                }
                
                errorMessage.classList.add('form-message');
                newsletterForm.appendChild(errorMessage);
            }
        });
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // AOS-like animation helper function
    function addAOSClasses() {
        document.querySelectorAll('[data-aos]').forEach(element => {
            element.classList.add('aos-init');
        });
    }
    
    // Add AOS classes
    addAOSClasses();
    
    // Add styles for AOS animations if not already in CSS
    if (!document.querySelector('#aos-styles')) {
        const style = document.createElement('style');
        style.id = 'aos-styles';
        style.textContent = `
            [data-aos] {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            [data-aos].aos-animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .aos-init {
                pointer-events: none;
            }
            
            .aos-animate {
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);
    }
});
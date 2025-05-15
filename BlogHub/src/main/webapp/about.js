// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Profile dropdown functionality
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    
    // Toggle dropdown when clicking the profile icon
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when clicking inside it
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Team filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const teamMembers = document.querySelectorAll('.team-member');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to the clicked button
            this.classList.add('active');
            
            // Get filter type
            const filter = this.getAttribute('data-filter');
            
            // Show/hide team members based on filter
            teamMembers.forEach(member => {
                if (filter === 'all') {
                    member.style.display = 'block';
                } else {
                    if (member.getAttribute('data-role') === filter) {
                        member.style.display = 'block';
                    } else {
                        member.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Timeline animation on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Add animation class to timeline items when they come into view
    function handleScroll() {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('animate');
            }
        });
    }
    
    // Add CSS for timeline animation
    const style = document.createElement('style');
    style.textContent = `
        .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .timeline-item.animate {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Run on scroll
    window.addEventListener('scroll', handleScroll);
    
    // Run once on initial load to check for items already in viewport
    handleScroll();
    
    // Add active class to the dropdown menu for CSS targeting
    if (profileDropdown) {
        const dropdownStyle = document.createElement('style');
        dropdownStyle.textContent = `
            .dropdown-menu.active {
                display: block;
            }
        `;
        document.head.appendChild(dropdownStyle);
    }
    
    // Add hover effects for social icons in team member cards
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.color = '#3498db';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.color = 'white';
        });
    });
});
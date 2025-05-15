document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('registration-form');
    const userTypeOptions = document.querySelectorAll('.user-type-option');
    const userTypeInput = document.getElementById('user-type-input');
    const creatorFields = document.querySelectorAll('.creator-field');
    const viewerFields = document.querySelectorAll('.viewer-field');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');
    const fullNameInput = document.getElementById('full-name');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const bioInput = document.getElementById('bio');
    
    // Session Management
    initializeSession();
    
    // User Type Selector
    userTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const userType = this.getAttribute('data-type');
            
            // Remove active class from all options
            userTypeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Update hidden input
            userTypeInput.value = userType;
            
            // Show/hide fields based on user type
            if (userType === 'creator') {
                creatorFields.forEach(field => field.style.display = 'block');
                viewerFields.forEach(field => field.style.display = 'none');
            } else {
                creatorFields.forEach(field => field.style.display = 'none');
                viewerFields.forEach(field => field.style.display = 'block');
            }
            
            // Update session
            saveToSession('userType', userType);
        });
    });
    
    // Password Toggle
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
    
    // Password Strength Checker
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        saveToSession('passwordStrength', getPasswordStrength(this.value));
    });
    
    // Form Validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Save form data to session
            saveFormToSession();
            
            // Submit form
            this.submit();
        }
    });
    
    // Input field listeners for session saving
    [fullNameInput, usernameInput, emailInput, bioInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                saveToSession(this.id, this.value);
            });
        }
    });
    
    // Interest chip selection listeners
    const interestChips = document.querySelectorAll('.interest-chip input[type="checkbox"]');
    interestChips.forEach(chip => {
        chip.addEventListener('change', function() {
            saveInterestsToSession();
        });
    });
    
    /**
     * Initialize session data from localStorage if available
     */
    function initializeSession() {
        const sessionData = getSessionData();
        
        if (sessionData) {
            // Restore form fields from session
            if (sessionData.fullName) fullNameInput.value = sessionData.fullName;
            if (sessionData.username) usernameInput.value = sessionData.username;
            if (sessionData.email) emailInput.value = sessionData.email;
            if (sessionData.bio && bioInput) bioInput.value = sessionData.bio;
            
            // Restore user type
            if (sessionData.userType) {
                userTypeInput.value = sessionData.userType;
                userTypeOptions.forEach(option => {
                    if (option.getAttribute('data-type') === sessionData.userType) {
                        option.click();
                    }
                });
            }
            
            // Restore interests
            if (sessionData.interests && sessionData.interests.length > 0) {
                sessionData.interests.forEach(interest => {
                    const interestInput = document.getElementById(interest);
                    if (interestInput) interestInput.checked = true;
                });
            }
            
            // Restore reading interests
            if (sessionData.readingInterests && sessionData.readingInterests.length > 0) {
                sessionData.readingInterests.forEach(interest => {
                    const interestInput = document.getElementById(interest + '-read');
                    if (interestInput) interestInput.checked = true;
                });
            }
            
            // Restore notification preference
            const notificationPref = document.getElementById('notification-preference');
            if (sessionData.notificationPreference && notificationPref) {
                notificationPref.value = sessionData.notificationPreference;
            }
        }
    }
    
    /**
     * Save form data to session storage
     */
    function saveFormToSession() {
        const formData = {
            fullName: fullNameInput.value,
            username: usernameInput.value,
            email: emailInput.value,
            bio: bioInput ? bioInput.value : '',
            userType: userTypeInput.value,
            interests: getSelectedInterests(),
            readingInterests: getSelectedReadingInterests(),
            notificationPreference: document.getElementById('notification-preference') ? 
                document.getElementById('notification-preference').value : 'daily',
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('blogHubRegistration', JSON.stringify(formData));
    }
    
    /**
     * Save specific field to session
     */
    function saveToSession(key, value) {
        const sessionData = getSessionData() || {};
        sessionData[key] = value;
        sessionData.lastUpdated = new Date().toISOString();
        
        localStorage.setItem('blogHubRegistration', JSON.stringify(sessionData));
    }
    
    /**
     * Save interests to session
     */
    function saveInterestsToSession() {
        const sessionData = getSessionData() || {};
        
        // Save writing interests
        sessionData.interests = getSelectedInterests();
        
        // Save reading interests
        sessionData.readingInterests = getSelectedReadingInterests();
        
        sessionData.lastUpdated = new Date().toISOString();
        localStorage.setItem('blogHubRegistration', JSON.stringify(sessionData));
    }
    
    /**
     * Get session data from localStorage
     */
    function getSessionData() {
        const data = localStorage.getItem('blogHubRegistration');
        return data ? JSON.parse(data) : null;
    }
    
    /**
     * Get selected writing interests
     */
    function getSelectedInterests() {
        const interests = [];
        const interestInputs = document.querySelectorAll('input[name="interests"]:checked');
        
        interestInputs.forEach(input => {
            interests.push(input.id);
        });
        
        return interests;
    }
    
    /**
     * Get selected reading interests
     */
    function getSelectedReadingInterests() {
        const interests = [];
        const interestInputs = document.querySelectorAll('input[name="reading-interests"]:checked');
        
        interestInputs.forEach(input => {
            interests.push(input.id.replace('-read', ''));
        });
        
        return interests;
    }
    
    /**
     * Check password strength and update UI
     */
    function checkPasswordStrength(password) {
        const strength = getPasswordStrength(password);
        
        // Reset classes
        strengthIndicator.className = '';
        strengthIndicator.classList.add('strength-indicator');
        
        // Add appropriate class based on strength
        if (password.length === 0) {
            strengthIndicator.style.width = '0';
            strengthText.textContent = 'Password strength';
        } else if (strength < 25) {
            strengthIndicator.classList.add('strength-weak');
            strengthText.textContent = 'Weak: Try adding numbers and symbols';
        } else if (strength < 50) {
            strengthIndicator.classList.add('strength-medium');
            strengthText.textContent = 'Medium: Try adding uppercase letters';
        } else if (strength < 75) {
            strengthIndicator.classList.add('strength-good');
            strengthText.textContent = 'Good: Almost there!';
        } else {
            strengthIndicator.classList.add('strength-strong');
            strengthText.textContent = 'Strong: Excellent password!';
        }
        
        strengthIndicator.style.width = strength + '%';
    }
    
    /**
     * Calculate password strength percentage
     */
    function getPasswordStrength(password) {
        let strength = 0;
        
        if (password.length === 0) return 0;
        
        // Length contribution (up to 25%)
        const lengthScore = Math.min(25, Math.floor(password.length * 2.5));
        strength += lengthScore;
        
        // Complexity contribution (up to 75%)
        if (/[A-Z]/.test(password)) strength += 15; // Uppercase
        if (/[a-z]/.test(password)) strength += 10; // Lowercase
        if (/[0-9]/.test(password)) strength += 15; // Numbers
        if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special chars
        
        // Variety contribution
        const varietyCount = (/[A-Z]/.test(password) ? 1 : 0) +
                             (/[a-z]/.test(password) ? 1 : 0) +
                             (/[0-9]/.test(password) ? 1 : 0) +
                             (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
        
        if (varietyCount >= 3) strength += 15;
        
        return Math.min(100, strength);
    }
    
    /**
     * Add error styling to an input field
     */
    function showError(inputElement, message) {
        // Remove any existing error message
        const existingError = inputElement.parentElement.querySelector('.validator-message');
        if (existingError) {
            existingError.parentElement.removeChild(existingError);
        }
        
        // Add error class to input
        inputElement.classList.add('input-error');
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'validator-message';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Insert error message after input wrapper
        inputElement.parentElement.parentElement.appendChild(errorElement);
        
        return false;
    }
    
    /**
     * Remove error styling from an input field
     */
    function removeError(inputElement) {
        inputElement.classList.remove('input-error');
        
        // Remove error message if exists
        const errorElement = inputElement.parentElement.parentElement.querySelector('.validator-message');
        if (errorElement) {
            errorElement.parentElement.removeChild(errorElement);
        }
    }
    
    /**
     * Validate form fields
     */
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.validator-message').forEach(error => {
            error.parentElement.removeChild(error);
        });
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
        
        // Validate full name
        if (fullNameInput.value.trim() === '') {
            isValid = showError(fullNameInput, 'Please enter your full name');
        } else if (fullNameInput.value.trim().length < 3) {
            isValid = showError(fullNameInput, 'Name must be at least 3 characters');
        } else {
            removeError(fullNameInput);
        }
        
        // Validate username
        if (usernameInput.value.trim() === '') {
            isValid = showError(usernameInput, 'Please enter a username');
        } else if (usernameInput.value.trim().length < 4) {
            isValid = showError(usernameInput, 'Username must be at least 4 characters');
        } else if (!/^[a-zA-Z0-9_]+$/.test(usernameInput.value)) {
            isValid = showError(usernameInput, 'Username can only contain letters, numbers, and underscores');
        } else {
            removeError(usernameInput);
        }
        
        // Validate email
        if (emailInput.value.trim() === '') {
            isValid = showError(emailInput, 'Please enter your email address');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            isValid = showError(emailInput, 'Please enter a valid email address');
        } else {
            removeError(emailInput);
        }
        
        // Validate password
        if (passwordInput.value === '') {
            isValid = showError(passwordInput, 'Please enter a password');
        } else if (passwordInput.value.length < 8) {
            isValid = showError(passwordInput, 'Password must be at least 8 characters');
        } else if (getPasswordStrength(passwordInput.value) < 50) {
            isValid = showError(passwordInput, 'Please use a stronger password');
        } else {
            removeError(passwordInput);
        }
        
        // Validate confirm password
        if (confirmPasswordInput.value === '') {
            isValid = showError(confirmPasswordInput, 'Please confirm your password');
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            isValid = showError(confirmPasswordInput, 'Passwords do not match');
        } else {
            removeError(confirmPasswordInput);
        }
        
        // Validate interests based on user type
        if (userTypeInput.value === 'creator') {
            const selectedInterests = document.querySelectorAll('input[name="interests"]:checked');
            if (selectedInterests.length === 0) {
                const interestsContainer = document.querySelector('.interests-container');
                const errorElement = document.createElement('div');
                errorElement.className = 'validator-message';
                errorElement.textContent = 'Please select at least one writing interest';
                errorElement.style.display = 'block';
                interestsContainer.parentElement.appendChild(errorElement);
                isValid = false;
            }
        } else if (userTypeInput.value === 'viewer') {
            const selectedReadingInterests = document.querySelectorAll('input[name="reading-interests"]:checked');
            if (selectedReadingInterests.length === 0) {
                const interestsContainer = document.querySelectorAll('.interests-container')[1];
                const errorElement = document.createElement('div');
                errorElement.className = 'validator-message';
                errorElement.textContent = 'Please select at least one reading interest';
                errorElement.style.display = 'block';
                interestsContainer.parentElement.appendChild(errorElement);
                isValid = false;
            }
        }
        
        // Validate terms agreement
        const termsCheckbox = document.getElementById('terms-agreement');
        if (!termsCheckbox.checked) {
            const errorElement = document.createElement('div');
            errorElement.className = 'validator-message';
            errorElement.textContent = 'You must agree to the terms and privacy policy';
            errorElement.style.display = 'block';
            termsCheckbox.parentElement.parentElement.appendChild(errorElement);
            isValid = false;
        }
        
        return isValid;
    }
    
    // Add form field focus and blur events
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Skip checkbox inputs
        if (input.type === 'checkbox' || input.type === 'hidden') return;
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
    
    // Add session timeout functionality
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    let sessionTimer;
    
    function resetSessionTimer() {
        clearTimeout(sessionTimer);
        sessionTimer = setTimeout(function() {
            // Check if there's actual data to clear
            const sessionData = getSessionData();
            if (sessionData && Object.keys(sessionData).length > 0) {
                // Show timeout message
                const timeoutMessage = document.createElement('div');
                timeoutMessage.className = 'session-timeout-message';
                timeoutMessage.innerHTML = `
                    <div class="timeout-content">
                        <i class="fas fa-exclamation-circle"></i>
                        <h3>Session Expired</h3>
                        <p>Your session has expired due to inactivity.</p>
                        <button id="resume-session">Resume Session</button>
                        <button id="clear-session">Start Over</button>
                    </div>
                `;
                
                // Apply styles to the timeout message
                Object.assign(timeoutMessage.style, {
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: '9999'
                });
                
                // Style the content container
                const timeoutContent = timeoutMessage.querySelector('.timeout-content');
                Object.assign(timeoutContent.style, {
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    maxWidth: '450px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                });
                
                // Style the icon
                const icon = timeoutMessage.querySelector('.fa-exclamation-circle');
                Object.assign(icon.style, {
                    fontSize: '3rem',
                    color: '#e74c3c',
                    marginBottom: '1rem'
                });
                
                // Style the heading
                const heading = timeoutMessage.querySelector('h3');
                Object.assign(heading.style, {
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem'
                });
                
                // Style the paragraph
                const paragraph = timeoutMessage.querySelector('p');
                Object.assign(paragraph.style, {
                    marginBottom: '1.5rem',
                    color: '#666'
                });
                
                // Style the buttons
                const buttons = timeoutMessage.querySelectorAll('button');
                buttons.forEach(button => {
                    Object.assign(button.style, {
                        padding: '0.75rem 1.5rem',
                        margin: '0 0.5rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    });
                });
                
                // Style the resume button
                const resumeButton = timeoutMessage.querySelector('#resume-session');
                Object.assign(resumeButton.style, {
                    backgroundColor: '#4a6bff',
                    color: '#fff'
                });
                
                // Style the clear button
                const clearButton = timeoutMessage.querySelector('#clear-session');
                Object.assign(clearButton.style, {
                    backgroundColor: '#f8fafc',
                    color: '#546e7a',
                    border: '1px solid #e1e8ed'
                });
                
                document.body.appendChild(timeoutMessage);
                
                // Add event listeners for the buttons
                document.getElementById('resume-session').addEventListener('click', function() {
                    document.body.removeChild(timeoutMessage);
                    resetSessionTimer();
                });
                
                document.getElementById('clear-session').addEventListener('click', function() {
                    localStorage.removeItem('blogHubRegistration');
                    document.body.removeChild(timeoutMessage);
                    window.location.reload();
                });
            }
        }, SESSION_TIMEOUT);
    }
    
    // Initialize session timer
    resetSessionTimer();
    
    // Reset timer on user activity
    ['mousemove', 'keypress', 'click', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetSessionTimer);
    });
    
    // Auto-save form data every minute
    setInterval(function() {
        if (document.querySelector('.session-timeout-message')) return;
        saveFormToSession();
    }, 60000);
    
    // Social button functionality
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 
                            this.classList.contains('facebook') ? 'Facebook' : 'Twitter';
            
            alert(`Authentication with ${provider} would be implemented here. This is just a demonstration.`);
        });
    });
});
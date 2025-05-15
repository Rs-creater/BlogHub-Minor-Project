document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabLinks = document.querySelectorAll('.settings-nav li');
    const tabContents = document.querySelectorAll('.settings-tab');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // User Type Selector
    const userTypeOptions = document.querySelectorAll('.user-type-option');
    const userTypeInput = document.getElementById('user-type-input');
    const creatorFields = document.querySelectorAll('.creator-field');
    const viewerFields = document.querySelectorAll('.viewer-field');
    
    userTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            userTypeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update hidden input value
            const userType = this.getAttribute('data-type');
            userTypeInput.value = userType;
            
            // Show/hide appropriate fields based on user type
            if (userType === 'creator') {
                creatorFields.forEach(field => field.style.display = 'block');
                viewerFields.forEach(field => field.style.display = 'none');
            } else {
                creatorFields.forEach(field => field.style.display = 'none');
                viewerFields.forEach(field => field.style.display = 'block');
            }
        });
    });
    
    // Password Toggle Visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-for') || 'new-password';
            const passwordInput = document.getElementById(targetId);
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
    
    // Password Strength Meter
    const passwordInput = document.getElementById('new-password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');
    
    if (passwordInput && strengthIndicator && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = calculatePasswordStrength(password);
            
            // Update strength meter
            strengthIndicator.style.width = strength.percent + '%';
            strengthIndicator.style.backgroundColor = strength.color;
            strengthText.textContent = strength.message;
        });
    }
    
    function calculatePasswordStrength(password) {
        // Simple password strength calculation
        if (!password) {
            return { percent: 0, color: '#e74c3c', message: 'Password strength' };
        }
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 25;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 25; // Has uppercase
        if (/[0-9]/.test(password)) strength += 25; // Has number
        if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Has special char
        
        let color, message;
        
        if (strength <= 25) {
            color = '#e74c3c'; // Red
            message = 'Weak password';
        } else if (strength <= 50) {
            color = '#f39c12'; // Orange
            message = 'Moderate password';
        } else if (strength <= 75) {
            color = '#3498db'; // Blue
            message = 'Strong password';
        } else {
            color = '#2ecc71'; // Green
            message = 'Very strong password';
        }
        
        return { percent: strength, color, message };
    }
    
    // Avatar Upload
    const uploadBtn = document.querySelector('.upload-btn');
    const avatarInput = document.getElementById('avatar-input');
    const currentAvatar = document.querySelector('.current-avatar');
    const removeBtn = document.querySelector('.remove-btn');
    
    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', function() {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    currentAvatar.style.backgroundImage = `url('${event.target.result}')`;
                };
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
        
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                avatarInput.value = '';
                currentAvatar.style.backgroundImage = "url('https://via.placeholder.com/80')";
            });
        }
    }
    
    // Two-Factor Authentication Toggle
    const tfaToggleBtn = document.querySelector('.tfa-toggle-btn');
    const statusIndicator = document.querySelector('.status-indicator');
    const statusTitle = document.querySelector('.status-title');
    const statusDesc = document.querySelector('.status-desc');
    
    if (tfaToggleBtn && statusIndicator && statusTitle && statusDesc) {
        tfaToggleBtn.addEventListener('click', function() {
            // Check current state and toggle
            const isEnabled = statusIndicator.classList.contains('enabled');
            
            if (isEnabled) {
                // Disable 2FA
                statusIndicator.classList.remove('enabled');
                statusIndicator.classList.add('disabled');
                statusTitle.textContent = 'Two-Factor Authentication is disabled';
                statusDesc.textContent = 'Enable two-factor authentication for enhanced account security';
                tfaToggleBtn.textContent = 'Enable';
                tfaToggleBtn.style.backgroundColor = '#2ecc71';
            } else {
                // Enable 2FA (in a real app, this would show a setup process)
                statusIndicator.classList.remove('disabled');
                statusIndicator.classList.add('enabled');
                statusTitle.textContent = 'Two-Factor Authentication is enabled';
                statusDesc.textContent = 'Your account is protected with an additional layer of security';
                tfaToggleBtn.textContent = 'Disable';
                tfaToggleBtn.style.backgroundColor = '#e74c3c';
            }
        });
    }
    
    // Form Submission Handlers
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission - in a real app this would send data to a server
            const submitBtn = this.querySelector('.save-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span>Saving...</span>';
            submitBtn.disabled = true;
            
            // Simulate server request
            setTimeout(() => {
                // Show success state
                submitBtn.innerHTML = '<span>Saved!</span>';
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
                
                // You could display a success message here
                showNotification('Changes saved successfully!');
            }, 1000);
        });
    });
    
    // Connect/Disconnect Social Account Buttons
    const connectBtns = document.querySelectorAll('.connect-btn');
    const disconnectBtns = document.querySelectorAll('.disconnect-btn');
    
    connectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const connectionDetails = this.previousElementSibling;
            const statusText = connectionDetails.querySelector('.connection-status');
            
            // Simulate connection process
            this.textContent = 'Connecting...';
            this.disabled = true;
            
            setTimeout(() => {
                statusText.textContent = 'john.doe@example.com';
                statusText.classList.remove('connection-status');
                statusText.classList.add('connection-email');
                
                this.textContent = 'Disconnect';
                this.classList.remove('connect-btn');
                this.classList.add('disconnect-btn');
                this.disabled = false;
                
                showNotification('Social account connected successfully!');
            }, 1000);
        });
    });
    
    disconnectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const connectionDetails = this.previousElementSibling;
            const emailText = connectionDetails.querySelector('.connection-email');
            
            // Simulate disconnection process
            this.textContent = 'Disconnecting...';
            this.disabled = true;
            
            setTimeout(() => {
                emailText.textContent = 'Not connected';
                emailText.classList.remove('connection-email');
                emailText.classList.add('connection-status');
                
                this.textContent = 'Connect';
                this.classList.remove('disconnect-btn');
                this.classList.add('connect-btn');
                this.disabled = false;
                
                showNotification('Social account disconnected successfully!');
            }, 1000);
        });
    });
    
    // Session Management
    const logoutBtns = document.querySelectorAll('.logout-btn');
    const logoutAllBtn = document.querySelector('.logout-all-btn');
    
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionItem = this.closest('.session-item');
            
            // Simulate logout process
            this.textContent = 'Logging out...';
            this.disabled = true;
            
            setTimeout(() => {
                sessionItem.style.opacity = '0.5';
                this.textContent = 'Logged out';
                showNotification('Device logged out successfully!');
            }, 1000);
        });
    });
    
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', function() {
            const sessionItems = document.querySelectorAll('.session-item:not(.current)');
            const logoutButtons = document.querySelectorAll('.logout-btn');
            
            // Simulate logout all process
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out all devices...';
            this.disabled = true;
            
            // Disable individual logout buttons
            logoutButtons.forEach(btn => {
                btn.disabled = true;
            });
            
            setTimeout(() => {
                sessionItems.forEach(item => {
                    item.style.opacity = '0.5';
                    const btn = item.querySelector('.logout-btn');
                    if (btn) btn.textContent = 'Logged out';
                });
                
                this.innerHTML = '<i class="fas fa-check"></i> All devices logged out';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sign-out-alt"></i> Log out of all other devices';
                    this.disabled = false;
                }, 1500);
                
                showNotification('All other devices have been logged out!');
            }, 1500);
        });
    }
    
    // Danger Zone Buttons
    const deactivateBtn = document.querySelector('.deactivate-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to deactivate your account? Your profile will be hidden until you log in again.')) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deactivating...';
                this.disabled = true;
                
                setTimeout(() => {
                    showNotification('Account deactivated. You will be logged out shortly.', 'warning');
                    
                    // Simulate redirect to login page
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('WARNING: This action cannot be undone. Are you absolutely sure you want to permanently delete your account and all associated data?')) {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
                this.disabled = true;
                
                setTimeout(() => {
                    showNotification('Account deleted successfully. Redirecting to homepage...', 'error');
                    
                    // Simulate redirect to homepage
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    // Notification Function
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon;
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        notification.innerHTML = `
            ${icon}
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set auto-dismiss timer
        const dismissTimeout = setTimeout(() => {
            dismissNotification(notification);
        }, 5000);
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(dismissTimeout);
            dismissNotification(notification);
        });
    }
    
    function dismissNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Add notification styles if not already in CSS
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: white;
            border-left: 4px solid #4f74c8;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1000;
            max-width: 350px;
            font-size: 0.9rem;
            border-radius: 4px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left-color: #2ecc71;
        }
        
        .notification.success i {
            color: #2ecc71;
        }
        
        .notification.error {
            border-left-color: #e74c3c;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
        
        .notification.warning {
            border-left-color: #f39c12;
        }
        
        .notification.warning i {
            color: #f39c12;
        }
        
        .notification i {
            font-size: 1.2rem;
            color: #4f74c8;
        }
        
        .notification-close {
            margin-left: auto;
            background: none;
            border: none;
            cursor: pointer;
            color: #888;
            padding: 0;
        }
        
        .notification-close:hover {
            color: #333;
        }
    `;
    
    document.head.appendChild(notificationStyles);
});
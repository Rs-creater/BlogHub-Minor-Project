document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('image');
    const videoInput = document.getElementById('video');
    const previewImage = document.getElementById('previewImage');
    const previewVideo = document.getElementById('previewVideo');
    const previewImageContainer = document.getElementById('previewImageContainer');
    const previewVideoContainer = document.getElementById('previewVideoContainer');
    
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            // Reset previous error messages
            clearErrorMessages();
            
            let isValid = true;
            
            // Validate title (required, min length 3)
            if (titleInput.value.trim().length < 3) {
                showError(titleInput, 'Title must be at least 3 characters long');
                isValid = false;
            }
            
            // Validate description (required)
            if (descriptionInput.value.trim() === '') {
                showError(descriptionInput, 'Please enter a description');
                isValid = false;
            }
            
            // Validate that at least one media file is selected
            if (imageInput.files.length === 0 && videoInput.files.length === 0) {
                showError(imageInput, 'Please select at least an image or a video');
                isValid = false;
            }
            
            // Check image file type
            if (imageInput.files.length > 0) {
                const file = imageInput.files[0];
                const fileType = file.type;
                const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                
                if (!validImageTypes.includes(fileType)) {
                    showError(imageInput, 'Please select a valid image file (JPEG, PNG, GIF)');
                    isValid = false;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showError(imageInput, 'Image file is too large. Maximum size is 5MB');
                    isValid = false;
                }
            }
            
            // Check video file type
            if (videoInput.files.length > 0) {
                const file = videoInput.files[0];
                const fileType = file.type;
                const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
                
                if (!validVideoTypes.includes(fileType)) {
                    showError(videoInput, 'Please select a valid video file (MP4, WebM, Ogg)');
                    isValid = false;
                }
                
                // Check file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showError(videoInput, 'Video file is too large. Maximum size is 10MB');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }
    
    // Image preview functionality
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImageContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(this.files[0]);
            } else {
                previewImageContainer.style.display = 'none';
            }
        });
    }
    
    // Video preview functionality
    if (videoInput) {
        videoInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewVideo.src = e.target.result;
                    previewVideoContainer.style.display = 'block';
                };
                
                reader.readAsDataURL(this.files[0]);
            } else {
                previewVideoContainer.style.display = 'none';
            }
        });
    }
    
    // Helper function to display error message
    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        // Add red border to the input
        inputElement.style.borderColor = 'red';
    }
    
    // Helper function to clear all error messages
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function(element) {
            element.remove();
        });
        
        // Reset all input borders
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(function(input) {
            input.style.borderColor = '#ddd';
        });
    }
});
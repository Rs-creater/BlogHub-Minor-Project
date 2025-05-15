document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const openUpdateBtn = document.getElementById('openUpdateBtn');
    const updateModal = document.getElementById('updateModal');
    const closeModal = document.getElementById('closeModal');
    const saveBtn = document.querySelector('.save-btn');
    const profileInputs = document.querySelectorAll('#updateModal .modal-content input');
    const profileName = document.querySelector('.profile-text h2');
    const profileRole = document.querySelector('.profile-text p:nth-of-type(1)');
    const profileBio = document.querySelector('.profile-text p:nth-of-type(2)');
    const contactInfo = document.querySelectorAll('.contact-card');
    const deleteButtons = document.querySelectorAll('.delete');
    const editButtons = document.querySelectorAll('.edit');
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const saveNewPost = document.getElementById('saveNewPost');
    const postGrid = document.querySelector('.post-grid');
    const editPostModal = document.getElementById('editPostModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const saveEditPost = document.getElementById('saveEditPost');
  
    // Initial profile data
    let profileData = {
      name: 'Rohit Sinha',
      role: 'Digital Creator',
      bio: 'Sharing thoughts and experiences through content.',
      email: 'rohitsinha@example.com',
      location: 'New York, USA',
      phone: '6267212341',
      website: 'https://replit.com/@shivamahirwar'
    };
  
    // Toast notification function
    function showToast(message, type = 'success') {
      // Create toast element if it doesn't exist
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      
      // Set message, type and show
      toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
      toast.classList.remove('error');
      if (type === 'error') {
        toast.classList.add('error');
      }
      toast.classList.add('show');
      
      // Hide after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  
    // Function to update the UI with new profile data
    function updateProfileUI() {
      profileName.textContent = profileData.name;
      profileRole.textContent = profileData.role;
      
      // Update contact cards
      contactInfo[0].innerHTML = `<i class="fas fa-envelope"></i> ${profileData.email}`;
      contactInfo[1].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${profileData.location}`;
      contactInfo[2].innerHTML = `<i class="fas fa-phone"></i> ${profileData.phone}`;
      contactInfo[3].innerHTML = `<i class="fas fa-globe"></i> ${profileData.website}`;
    }
  
    // Function to handle post deletion
    function handleDeletePost() {
      const postCard = this.closest('.post-card');
      
      // Add delete animation
      postCard.style.opacity = '0';
      postCard.style.transform = 'scale(0.8)';
      
      // Remove the element after animation
      setTimeout(() => {
        postCard.remove();
        showToast('Post deleted successfully!');
      }, 300);
    }
  
    // Function to handle post editing
    function handleEditPost() {
      const postCard = this.closest('.post-card');
      const postId = postCard.getAttribute('data-id');
      const postTitle = postCard.querySelector('h3').textContent;
      const postCategory = postCard.querySelector('.tag').textContent;
      const postContent = postCard.querySelector('p').textContent.replace('...', '');
      
      // Populate the edit form
      document.getElementById('edit-post-title').value = postTitle;
      document.getElementById('edit-post-category').value = postCategory;
      document.getElementById('edit-post-content').value = postContent;
      document.getElementById('edit-post-id').value = postId;
      
      // Show the edit modal
      editPostModal.style.display = 'flex';
    }
  
    // Event Listeners
    
    // Profile update modal
    if (openUpdateBtn) {
      openUpdateBtn.addEventListener('click', () => {
        // Populate form with current values
        profileInputs[0].value = profileData.name;
        profileInputs[1].value = profileData.role;
        profileInputs[2].value = profileData.email;
        profileInputs[3].value = profileData.phone;
        profileInputs[4].value = profileData.location;
        profileInputs[5].value = profileData.website;
        
        // Show the modal
        updateModal.style.display = 'flex';
      });
    }
    
    if (closeModal) {
      closeModal.addEventListener('click', () => {
        updateModal.style.display = 'none';
      });
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        // Update profile data object
        profileData = {
          name: profileInputs[0].value || profileData.name,
          role: profileInputs[1].value || profileData.role,
          bio: profileData.bio, // Bio isn't editable in the form
          email: profileInputs[2].value || profileData.email,
          phone: profileInputs[3].value || profileData.phone,
          location: profileInputs[4].value || profileData.location,
          website: profileInputs[5].value || profileData.website
        };
        
        // Update the visible profile
        updateProfileUI();
        
        // Close the modal
        updateModal.style.display = 'none';
        
        // Show success notification
        showToast('Profile updated successfully!');
      });
    }
    
    // Create post modal
    if (createPostBtn) {
      createPostBtn.addEventListener('click', () => {
        createPostModal.style.display = 'flex';
      });
    }
    
    if (closeCreateModal) {
      closeCreateModal.addEventListener('click', () => {
        createPostModal.style.display = 'none';
      });
    }
    
    if (saveNewPost) {
      saveNewPost.addEventListener('click', () => {
        const titleInput = createPostModal.querySelector('input[type="text"]');
        const categorySelect = createPostModal.querySelector('select');
        const contentTextarea = createPostModal.querySelector('textarea');
        
        if (titleInput && titleInput.value.trim() !== '') {
          // Get values
          const title = titleInput.value;
          const category = categorySelect && categorySelect.value ? categorySelect.value : 'General';
          const content = contentTextarea && contentTextarea.value ? contentTextarea.value : 'New post content...';
          
          // Create a unique ID for the new post
          const postId = 'post-' + Date.now();
          
          // Create new post element
          const newPost = document.createElement('div');
          newPost.className = 'post-card new';
          newPost.setAttribute('data-id', postId);
          
          // Add post content
          newPost.innerHTML = `
            <img src="https://via.placeholder.com/400x200" alt="Blog Post Image">
            <span class="tag">${category}</span>
            <h3>${title}</h3>
            <p>${content.substring(0, 100)}${content.length > 100 ? '...' : ''}</p>
            <div class="actions">
              <button class="btn edit"><i class="fas fa-edit"></i> Edit</button>
              <button class="btn delete"><i class="fas fa-trash"></i> Delete</button>
            </div>
            <div class="stats">
              <span><i class="fas fa-eye"></i> 0 Views</span>
              <span><i class="fas fa-heart"></i> 0 Likes</span>
              <span><i class="fas fa-comment"></i> 0 Comments</span>
            </div>
          `;
          
          // Add the new post to the beginning of the grid
          postGrid.prepend(newPost);
          
          // Add event listeners to the new buttons
          newPost.querySelector('.delete').addEventListener('click', handleDeletePost);
          newPost.querySelector('.edit').addEventListener('click', handleEditPost);
          
          // Clear the form
          titleInput.value = '';
          if (categorySelect) categorySelect.value = '';
          if (contentTextarea) contentTextarea.value = '';
          
          // Close the modal
          createPostModal.style.display = 'none';
          
          // Show success notification
          showToast('New post published successfully!');
        } else {
          showToast('Please enter a title for your post', 'error');
        }
      });
    }
    
    // Edit post modal
    if (closeEditModal) {
      closeEditModal.addEventListener('click', () => {
        editPostModal.style.display = 'none';
      });
    }
    
    if (saveEditPost) {
      saveEditPost.addEventListener('click', () => {
        const postId = document.getElementById('edit-post-id').value;
        const title = document.getElementById('edit-post-title').value;
        const category = document.getElementById('edit-post-category').value;
        const content = document.getElementById('edit-post-content').value;
        
        // Find the post card
        const postCard = document.querySelector(`.post-card[data-id="${postId}"]`);
        
        if (postCard && title.trim() !== '') {
          // Update post content
          postCard.querySelector('h3').textContent = title;
          postCard.querySelector('.tag').textContent = category;
          postCard.querySelector('p').textContent = content.substring(0, 100) + (content.length > 100 ? '...' : '');
          
          // Close the modal
          editPostModal.style.display = 'none';
          
          // Show success notification
          showToast('Post updated successfully!');
        } else {
          showToast('Please enter a title for your post', 'error');
        }
      });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === updateModal) {
        updateModal.style.display = 'none';
      }
      if (e.target === createPostModal) {
        createPostModal.style.display = 'none';
      }
      if (e.target === editPostModal) {
        editPostModal.style.display = 'none';
      }
    });
    
    // Add event listeners to existing buttons
    deleteButtons.forEach(button => {
      button.addEventListener('click', handleDeletePost);
    });
    
    editButtons.forEach(button => {
      button.addEventListener('click', handleEditPost);
    });
    
    // Make enter key work in profile update form
    profileInputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveBtn.click();
        }
      });
    });
  });
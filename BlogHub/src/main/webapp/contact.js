document.addEventListener('DOMContentLoaded', function() {
	const contactForm = document.getElementById('contactForm');
	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');
	const subjectInput = document.getElementById('subject');
	const messageInput = document.getElementById('message');

	const nameError = document.getElementById('nameError');
	const emailError = document.getElementById('emailError');
	const subjectError = document.getElementById('subjectError');
	const messageError = document.getElementById('messageError');

	const successMessage = document.getElementById('successMessage');

	contactForm.addEventListener('submit', function(e) {
		e.preventDefault();

		let isValid = true;

		// Reset error messages
		nameError.style.display = 'none';
		emailError.style.display = 'none';
		subjectError.style.display = 'none';
		messageError.style.display = 'none';

		// Validate name
		if (nameInput.value.trim() === '') {
			nameError.style.display = 'block';
			isValid = false;
		}

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailInput.value.trim())) {
			emailError.style.display = 'block';
			isValid = false;
		}

		// Validate subject
		if (subjectInput.value.trim() === '') {
			subjectError.style.display = 'block';
			isValid = false;
		}

		// Validate message
		if (messageInput.value.trim() === '') {
			messageError.style.display = 'block';
			isValid = false;
		}

		// If form is valid, "submit" the form
		if (isValid) {
			// In a real application, you would send the form data to the server here
			// For demonstration purposes, we'll just show a success message

			// Clear the form
			contactForm.reset();

			// Show success message
			successMessage.style.display = 'block';

			// Hide success message after 5 seconds
			setTimeout(function() {
				successMessage.style.display = 'none';
			}, 5000);
		}
	});
});
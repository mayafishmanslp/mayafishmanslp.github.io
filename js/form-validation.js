// Form Validation and Submission
(function() {
    'use strict';
    
    let form;
    let isSubmitting = false;
    
    // Initialize form validation when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initFormValidation();
    });
    
    /**
     * Initialize form validation system
     */
    function initFormValidation() {
        form = document.querySelector('#contactForm');
        if (!form) return;
        
        // Set up form submission
        setupFormSubmission();
        
        // Set up real-time validation
        setupRealtimeValidation();
        
        // Set up accessibility features
        setupAccessibilityFeatures();
    }
    
    /**
     * Set up form submission handling
     */
    function setupFormSubmission() {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (isSubmitting) return;
            
            // Validate entire form
            const isValid = validateForm();
            
            if (isValid) {
                submitForm();
            } else {
                // Focus on first error field
                const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }
    
    /**
     * Set up real-time validation for form fields
     */
    function setupRealtimeValidation() {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear errors on input (with debounce)
            input.addEventListener('input', debounce(function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            }, 300));
        });
        
        // Special handling for checkboxes and radios
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        const radios = form.querySelectorAll('input[type="radio"]');
        
        [...checkboxes, ...radios].forEach(input => {
            input.addEventListener('change', function() {
                validateField(this);
            });
        });
    }
    
    /**
     * Set up accessibility features
     */
    function setupAccessibilityFeatures() {
        // Add aria-describedby for form fields with errors
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const fieldName = input.name || input.id;
            if (fieldName) {
                input.setAttribute('aria-describedby', `${fieldName}-error`);
            }
        });
    }
    
    /**
     * Validate entire form
     */
    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        // Clear all previous errors
        clearAllErrors();
        
        // Validate required fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        // Validate email format
        const emailInput = form.querySelector('#email');
        if (emailInput && emailInput.value.trim()) {
            if (!validateEmail(emailInput.value)) {
                showFieldError(emailInput, getErrorMessage('invalid-email'));
                isValid = false;
            }
        }
        
        // Validate phone format (basic)
        const phoneInput = form.querySelector('#phone');
        if (phoneInput && phoneInput.value.trim()) {
            if (!validatePhone(phoneInput.value)) {
                showFieldError(phoneInput, getErrorMessage('invalid-phone'));
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        // Clear previous error
        clearFieldError(field);
        
        // Check required fields
        if (isRequired && !value) {
            showFieldError(field, getErrorMessage('required'));
            return false;
        }
        
        // Skip further validation if field is empty and not required
        if (!value && !isRequired) {
            return true;
        }
        
        // Validate specific field types
        switch (field.type) {
            case 'email':
                if (!validateEmail(value)) {
                    showFieldError(field, getErrorMessage('invalid-email'));
                    return false;
                }
                break;
                
            case 'tel':
                if (!validatePhone(value)) {
                    showFieldError(field, getErrorMessage('invalid-phone'));
                    return false;
                }
                break;
        }
        
        // Validate field length
        if (field.minLength && value.length < field.minLength) {
            showFieldError(field, getErrorMessage('too-short', field.minLength));
            return false;
        }
        
        if (field.maxLength && value.length > field.maxLength) {
            showFieldError(field, getErrorMessage('too-long', field.maxLength));
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate email format
     */
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone format (basic validation)
     */
    function validatePhone(phone) {
        // Remove all non-digit characters except + and -
        const cleanPhone = phone.replace(/[^\d+\-]/g, '');
        
        // Check if it has at least 7 digits (minimum for most phone numbers)
        const digitCount = cleanPhone.replace(/[^\d]/g, '').length;
        return digitCount >= 7 && digitCount <= 15;
    }
    
    /**
     * Show error for a specific field
     */
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        
        // Create or update error message
        const fieldName = field.name || field.id;
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.id = `${fieldName}-error`;
            errorElement.setAttribute('role', 'alert');
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Update aria-invalid
        field.setAttribute('aria-invalid', 'true');
    }
    
    /**
     * Clear error for a specific field
     */
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Update aria-invalid
        field.setAttribute('aria-invalid', 'false');
    }
    
    /**
     * Clear all form errors
     */
    function clearAllErrors() {
        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
        
        const invalidFields = form.querySelectorAll('[aria-invalid="true"]');
        invalidFields.forEach(field => {
            field.setAttribute('aria-invalid', 'false');
        });
    }
    
    /**
     * Get error message in current language
     */
    function getErrorMessage(type, param = null) {
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'en';
        
        const messages = {
            'required': {
                en: 'This field is required',
                he: 'שדה זה הוא חובה'
            },
            'invalid-email': {
                en: 'Please enter a valid email address',
                he: 'אנא הזינו כתובת אימייל תקינה'
            },
            'invalid-phone': {
                en: 'Please enter a valid phone number',
                he: 'אנא הזינו מספר טלפון תקין'
            },
            'too-short': {
                en: `Must be at least ${param} characters`,
                he: `חייב להכיל לפחות ${param} תווים`
            },
            'too-long': {
                en: `Must be no more than ${param} characters`,
                he: `חייב להכיל לא יותר מ-${param} תווים`
            }
        };
        
        return messages[type] ? messages[type][currentLang] : messages[type]['en'];
    }
    
    /**
     * Submit form data
     */
    function submitForm() {
        if (isSubmitting) return;
        
        isSubmitting = true;
        
        // Show loading state
        showLoadingState();
        
        // Collect form data
        const formData = collectFormData();
        
        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // For demo purposes, we'll just show success
            // In a real implementation, you would send data to a server
            handleSubmissionSuccess();
        }, 2000);
    }
    
    /**
     * Collect form data
     */
    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to regular object
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (like checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Add language information
        data.language = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'en';
        data.timestamp = new Date().toISOString();
        
        return data;
    }
    
    /**
     * Show loading state during submission
     */
    function showLoadingState() {
        const submitButton = form.querySelector('.submit-button');
        if (!submitButton) return;
        
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        const originalText = submitButton.textContent;
        const loadingText = window.LanguageToggle ? 
            window.LanguageToggle.getDynamicText('loading', window.LanguageToggle.getCurrentLanguage()) : 
            'Loading...';
        
        submitButton.textContent = loadingText;
        submitButton.setAttribute('data-original-text', originalText);
    }
    
    /**
     * Handle successful form submission
     */
    function handleSubmissionSuccess() {
        isSubmitting = false;
        
        // Hide loading state
        hideLoadingState();
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Clear any remaining errors
        clearAllErrors();
        
        // Scroll to success message
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            successMessage.focus();
        }
    }
    
    /**
     * Handle form submission error
     */
    function handleSubmissionError(error) {
        isSubmitting = false;
        
        // Hide loading state
        hideLoadingState();
        
        // Show error message
        showErrorMessage(error);
        
        console.error('Form submission error:', error);
    }
    
    /**
     * Hide loading state
     */
    function hideLoadingState() {
        const submitButton = form.querySelector('.submit-button');
        if (!submitButton) return;
        
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        
        const originalText = submitButton.getAttribute('data-original-text');
        if (originalText) {
            submitButton.textContent = originalText;
            submitButton.removeAttribute('data-original-text');
        }
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage() {
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'en';
        const message = window.LanguageToggle ? 
            window.LanguageToggle.getDynamicText('form-success', currentLang) : 
            'Thank you! Your message has been sent successfully.';
        
        showMessage(message, 'success');
    }
    
    /**
     * Show error message
     */
    function showErrorMessage(error) {
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'en';
        const message = window.LanguageToggle ? 
            window.LanguageToggle.getDynamicText('form-error', currentLang) : 
            'Sorry, there was an error sending your message. Please try again.';
        
        showMessage(message, 'error');
    }
    
    /**
     * Show message (success or error)
     */
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}-message`;
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'polite');
        messageElement.textContent = message;
        
        // Insert message before form
        form.parentNode.insertBefore(messageElement, form);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 10000);
    }
    
    /**
     * Utility function for debouncing
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Add CSS for form validation states
    function addValidationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-group.error input,
            .form-group.error textarea {
                border-color: #dc3545;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
            }
            
            .error-message {
                color: #dc3545;
                font-size: 14px;
                margin-top: 0.5rem;
                display: block;
            }
            
            .form-message {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 2rem;
                font-weight: 500;
            }
            
            .success-message {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .error-message.form-message {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            .submit-button.loading {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            .submit-button.loading::after {
                content: "";
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-left: 8px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add validation styles when script loads
    addValidationStyles();
    
})(); 
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
        
        // Length validation removed - no restrictions needed for this form
        
        return true;
    }
    
    /**
     * Validate email format
     */
    function validateEmail(email) {
        // More flexible email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email.trim());
    }
    
    /**
     * Validate phone format (basic validation)
     */
    function validatePhone(phone) {
        // Remove all non-digit characters except + and - and spaces
        const cleanPhone = phone.replace(/[^\d+\-\s()]/g, '');
        
        // Check if it has at least 5 digits (more flexible for various formats)
        const digitCount = cleanPhone.replace(/[^\d]/g, '').length;
        return digitCount >= 5 && digitCount <= 20; // More flexible range
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
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'he';
        
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
            }
        };
        
        return messages[type] ? messages[type][currentLang] : messages[type]['he'] || 'שגיאה בשדה';
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
        
        // Try to send email using multiple methods
        sendFormData(formData)
            .then((result) => {
                handleSubmissionSuccess(result);
            })
            .catch((error) => {
                handleSubmissionError(error);
            });
    }
    
    /**
     * Send form data via email
     */
    async function sendFormData(data) {
        // Primary method: Formspree
        const formspreeEndpoint = 'https://formspree.io/f/xanjozvq';
        
        try {
            return await sendViaFormspree(data, formspreeEndpoint);
        } catch (error) {
            console.warn('Formspree failed, falling back to mailto:', error);
            // Fallback to mailto (opens email client)
            return sendViaMailto(data);
        }
    }
    
    /**
     * Send via Formspree service
     */
    async function sendViaFormspree(data, endpoint) {
        const currentLang = data.language || 'he';
        const isHebrew = currentLang === 'he';
        
        // Format services array
        const services = Array.isArray(data.services) ? data.services.join(', ') : (data.services || '');
        
        // Create formatted message for Formspree
        const formattedMessage = isHebrew ? `
פרטי הפנייה:
שם: ${data.fullName}
טלפון: ${data.phone}
אימייל: ${data.email}
גיל הפונה: ${data.age || 'לא צוין'}
תחום הפנייה: ${services || 'לא צוין'}
אבחון קודם: ${data.priorAssessment || 'לא צוין'}

הערות נוספות:
${data.notes || 'אין הערות נוספות'}

שפת הפנייה: עברית
        `.trim() : `
Inquiry Details:
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}
Client Age: ${data.age || 'Not specified'}
Area of Inquiry: ${services || 'Not specified'}
Prior Assessment: ${data.priorAssessment || 'Not specified'}

Additional Notes:
${data.notes || 'No additional notes'}

Language: English
        `.trim();
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.fullName,
                email: data.email,
                phone: data.phone,
                message: formattedMessage,
                _subject: isHebrew ? 
                    `פנייה חדשה מהאתר - ${data.fullName}` : 
                    `New website inquiry - ${data.fullName}`,
                _replyto: data.email,
                _language: currentLang,
                _format: 'plain'
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Formspree error: ${response.status} - ${errorText}`);
        }
        
        return response.json();
    }
    
    /**
     * Send via mailto (opens email client)
     */
    function sendViaMailto(data) {
        return new Promise((resolve, reject) => {
            try {
                const currentLang = data.language || 'he';
                const isHebrew = currentLang === 'he';
                
                // Create email content
                const subject = isHebrew ? 
                    `פנייה חדשה מ-${data.fullName}` : 
                    `New inquiry from ${data.fullName}`;
                
                const services = Array.isArray(data.services) ? data.services.join(', ') : (data.services || '');
                
                const body = isHebrew ? `
שלום מאיה,

קיבלת פנייה חדשה מהאתר:

שם: ${data.fullName}
טלפון: ${data.phone}
אימייל: ${data.email}
גיל הפונה: ${data.age || 'לא צוין'}
תחום הפנייה: ${services || 'לא צוין'}
אבחון קודם: ${data.priorAssessment || 'לא צוין'}

הערות נוספות:
${data.notes || 'אין הערות נוספות'}

תאריך: ${new Date().toLocaleDateString('he-IL')}
                `.trim() : `
Hello Maya,

You have received a new inquiry from your website:

Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email}
Client Age: ${data.age || 'Not specified'}
Area of Inquiry: ${services || 'Not specified'}
Prior Assessment: ${data.priorAssessment || 'Not specified'}

Additional Notes:
${data.notes || 'No additional notes'}

Date: ${new Date().toLocaleDateString('en-US')}
                `.trim();
                
                // Create mailto URL
                const mailtoUrl = `mailto:mayafishman.slp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Open email client
                window.location.href = mailtoUrl;
                
                // Resolve after a short delay (assuming user will send the email)
                setTimeout(() => {
                    resolve({ method: 'mailto' });
                }, 1000);
                
            } catch (error) {
                reject(error);
            }
        });
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
    function handleSubmissionSuccess(result) {
        isSubmitting = false;
        
        // Hide loading state
        hideLoadingState();
        
        // Show success message
        showSuccessMessage(result);
        
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
    function showSuccessMessage(result) {
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'he';
        
        let message;
        if (result && result.method === 'mailto') {
            // Mailto fallback message
            message = currentLang === 'he' ? 
                'תודה! נפתח עבורכם חלון אימייל עם הפרטים. אנא שלחו את האימייל כדי להשלים את הפנייה.' :
                'Thank you! An email window has opened with your details. Please send the email to complete your inquiry.';
        } else {
            // Formspree success message
            message = currentLang === 'he' ? 
                'תודה! הפרטים נשלחו בהצלחה. אחזור אליכם בהקדם האפשרי.' :
                'Thank you! Your details have been sent successfully. I will get back to you as soon as possible.';
        }
        
        showMessage(message, 'success');
    }
    
    /**
     * Show error message
     */
    function showErrorMessage(error) {
        const currentLang = window.LanguageToggle ? window.LanguageToggle.getCurrentLanguage() : 'he';
        
        const message = currentLang === 'he' ? 
            'מצטערת, הייתה בעיה בשליחת הפרטים. אנא נסו שוב או צרו קשר ישירות.' :
            'Sorry, there was an error sending your details. Please try again or contact directly.';
        
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
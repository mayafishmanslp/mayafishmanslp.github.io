// Language Toggle Functionality
(function() {
    'use strict';
    
    let currentLanguage = 'he';
    const STORAGE_KEY = 'maya-fishman-language';
    
    // Initialize language system when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initLanguageSystem();
    });
    
    /**
     * Initialize the language system
     */
    function initLanguageSystem() {
        // Load saved language preference or detect browser language
        loadLanguagePreference();
        
        // Set up language toggle buttons
        setupLanguageToggle();
        
        // Apply initial language
        applyLanguage(currentLanguage);
        
        // Set up language detection
        detectBrowserLanguage();
    }
    
    /**
     * Load language preference from localStorage or browser
     */
    function loadLanguagePreference() {
        // Check localStorage first
        const savedLanguage = localStorage.getItem(STORAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'he')) {
            currentLanguage = savedLanguage;
            return;
        }
        
        // Fallback to browser language detection
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (browserLanguage.startsWith('he')) {
            currentLanguage = 'he';
        } else {
            currentLanguage = 'he'; // Default to Hebrew
        }
    }
    
    /**
     * Detect browser language and suggest language if different
     */
    function detectBrowserLanguage() {
        const browserLanguage = navigator.language || navigator.userLanguage;
        const savedLanguage = localStorage.getItem(STORAGE_KEY);
        
        // If no saved preference and browser is Hebrew, suggest Hebrew
        if (!savedLanguage && browserLanguage.startsWith('he') && currentLanguage === 'en') {
            // Could add a subtle notification here in the future
            console.log('Hebrew browser detected - language available');
        }
    }
    
    /**
     * Set up language toggle button event listeners
     */
    function setupLanguageToggle() {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetLanguage = this.getAttribute('data-lang');
                if (targetLanguage && targetLanguage !== currentLanguage) {
                    switchLanguage(targetLanguage);
                }
            });
            
            // Add keyboard support
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    /**
     * Switch to a different language
     */
    function switchLanguage(newLanguage) {
        if (newLanguage === currentLanguage) return;
        
        // Add transition class for smooth switching
        document.body.classList.add('language-switching');
        
        // Update current language
        currentLanguage = newLanguage;
        
        // Save preference
        localStorage.setItem(STORAGE_KEY, newLanguage);
        
        // Apply the new language
        applyLanguage(newLanguage);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('language-switching');
        }, 300);
        
        // Announce language change for screen readers
        announceLanguageChange(newLanguage);
    }
    
    /**
     * Apply language to the page
     */
    function applyLanguage(language) {
        // Update HTML lang and dir attributes
        const html = document.documentElement;
        html.setAttribute('lang', language === 'he' ? 'he' : 'en');
        html.setAttribute('dir', language === 'he' ? 'rtl' : 'ltr');
        
        // Update body classes
        const body = document.body;
        if (language === 'he') {
            body.classList.add('rtl');
            body.classList.remove('ltr');
        } else {
            body.classList.add('ltr');
            body.classList.remove('rtl');
        }
        
        // Update language toggle buttons
        updateLanguageButtons(language);
        
        // Update all text content
        updateTextContent(language);
        
        // Update page title
        updatePageTitle(language);
        
        // Update form placeholders and validation messages
        updateFormElements(language);
        
        // Trigger custom event for other scripts
        const languageChangeEvent = new CustomEvent('languageChanged', {
            detail: { language: language }
        });
        document.dispatchEvent(languageChangeEvent);
    }
    
    /**
     * Update language toggle button states
     */
    function updateLanguageButtons(activeLanguage) {
        const languageButtons = document.querySelectorAll('.lang-btn');
        
        languageButtons.forEach(button => {
            const buttonLanguage = button.getAttribute('data-lang');
            if (buttonLanguage === activeLanguage) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
            }
        });
    }
    
    /**
     * Update all text content based on data attributes
     */
    function updateTextContent(language) {
        const elements = document.querySelectorAll('[data-en][data-he]');
        
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                // Handle different element types
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = text;
                } else if (element.tagName === 'META') {
                    element.content = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }
    
    /**
     * Update page title
     */
    function updatePageTitle(language) {
        const titles = {
            en: 'Maya Fishman SLP - Speech and Language Pathologist',
            he: 'מאיה פישמן - קלינאית תקשורת'
        };
        
        document.title = titles[language] || titles.en;
    }
    
    /**
     * Update form elements (placeholders, labels, etc.)
     */
    function updateFormElements(language) {
        // Update form validation messages if they exist
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => {
            const text = message.getAttribute(`data-${language}`);
            if (text) {
                message.textContent = text;
            }
        });
        
        // Update any dynamic content that might have been added
        const dynamicElements = document.querySelectorAll('[data-dynamic-text]');
        dynamicElements.forEach(element => {
            const key = element.getAttribute('data-dynamic-text');
            const text = getDynamicText(key, language);
            if (text) {
                element.textContent = text;
            }
        });
    }
    
    /**
     * Get dynamic text for specific keys
     */
    function getDynamicText(key, language) {
        const texts = {
            'form-success': {
                en: 'Thank you! Your message has been sent successfully.',
                he: 'תודה! ההודעה שלכם נשלחה בהצלחה.'
            },
            'form-error': {
                en: 'Sorry, there was an error sending your message. Please try again.',
                he: 'מצטערים, הייתה שגיאה בשליחת ההודעה. אנא נסו שוב.'
            },
            'loading': {
                en: 'Loading...',
                he: 'טוען...'
            }
        };
        
        return texts[key] ? texts[key][language] : null;
    }
    
    /**
     * Announce language change for screen readers
     */
    function announceLanguageChange(language) {
        const announcements = {
            en: 'Language changed to English',
            he: 'השפה שונתה לעברית'
        };
        
        // Create temporary announcement element
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = announcements[language];
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    /**
     * Get current language
     */
    function getCurrentLanguage() {
        return currentLanguage;
    }
    
    /**
     * Check if current language is RTL
     */
    function isRTL() {
        return currentLanguage === 'he';
    }
    
    /**
     * Add smooth transition styles for language switching
     */
    function addLanguageSwitchingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .language-switching [data-en], 
            .language-switching [data-he] {
                transition: opacity 0.2s ease-in-out;
            }
            
            .language-switching.fade-out [data-en], 
            .language-switching.fade-out [data-he] {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add styles when script loads
    addLanguageSwitchingStyles();
    
    // Expose functions globally if needed
    window.LanguageToggle = {
        getCurrentLanguage: getCurrentLanguage,
        switchLanguage: switchLanguage,
        isRTL: isRTL,
        getDynamicText: getDynamicText
    };
    
})(); 
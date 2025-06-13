# Email Setup Guide for Maya Fishman SLP Website

## Current Status
The contact form is now functional and will open the user's email client with a pre-filled message. However, for a more seamless experience, you can set up one of the following email services:

## Option 1: Formspree (Recommended - Easy Setup)

1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint (looks like: `https://formspree.io/f/YOUR_FORM_ID`)
5. In `js/form-validation.js`, replace line 325:
   ```javascript
   const formspreeEndpoint = 'https://formspree.io/f/YOUR_ACTUAL_FORM_ID';
   ```
6. Update the `sendFormData` function to use Formspree:
   ```javascript
   async function sendFormData(data) {
       try {
           return await sendViaFormspree(data, formspreeEndpoint);
       } catch (error) {
           // Fallback to mailto
           return sendViaMailto(data);
       }
   }
   ```

## Option 2: EmailJS (Alternative)

1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up and create a service
3. Create an email template
4. Add EmailJS SDK to your HTML head:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
5. Implement EmailJS in the form validation script

## Option 3: Current Setup (mailto)

The form currently works by:
1. Collecting form data
2. Opening the user's default email client
3. Pre-filling the email with all form information
4. User sends the email manually

This is functional but requires users to have an email client configured.

## Testing the Form

1. Fill out the contact form
2. Click submit
3. Your email client should open with a pre-filled message
4. Send the email to receive the inquiry

## Customization

You can modify the email template in the `sendViaMailto` function in `js/form-validation.js` to change how the email is formatted.

## Validation Improvements Made

- Phone validation is now more flexible (5-20 digits, allows spaces, parentheses)
- Email validation is more robust
- Better error messages in Hebrew and English
- More informative success messages 
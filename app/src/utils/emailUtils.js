import emailjs from '@emailjs/browser';

/**
 * EmailJS configuration
 * These should be set as environment variables:
 * REACT_APP_EMAILJS_SERVICE_ID
 * REACT_APP_EMAILJS_TEMPLATE_ID
 * REACT_APP_EMAILJS_PUBLIC_KEY
 */
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

/**
 * Initialize EmailJS with public key
 */
export const initializeEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

/**
 * Send email notification using EmailJS
 * @param {string} title - Email subject (will replace {{title}} in template)
 * @param {string} body - Email body (will replace {{body}} in template)
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmailNotification = async (title, body) => {
  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS is not configured. Please set environment variables:');
    console.warn('- REACT_APP_EMAILJS_SERVICE_ID');
    console.warn('- REACT_APP_EMAILJS_TEMPLATE_ID');
    console.warn('- REACT_APP_EMAILJS_PUBLIC_KEY');
    return Promise.resolve(); // Don't throw error, just log warning
  }

  // Initialize EmailJS if not already done
  initializeEmailJS();

  try {
    const templateParams = {
      to_email: 'general@jcrpharma.co.uk',
      title: title,
      body: `${body}\n\nThis is an automated email generated.`
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw error - form submission should still succeed even if email fails
    return Promise.resolve();
  }
};


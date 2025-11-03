/**
 * Cookie utility functions for managing cookies and consent
 */

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 * @param {object} options - Additional cookie options
 */
export const setCookie = (name, value, days = 365, options = {}) => {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  const path = options.path || '/';
  const sameSite = options.sameSite || 'Lax';
  const secure = options.secure ? ';secure' : '';
  
  document.cookie = `${name}=${value};${expires};path=${path};SameSite=${sameSite}${secure}`;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path (default: '/')
 */
export const deleteCookie = (name, path = '/') => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
};

/**
 * Check if user has given cookie consent
 * @returns {boolean} - True if consent has been given
 */
export const hasCookieConsent = () => {
  const consent = getCookie('jcr_cookie_consent');
  return consent === 'accepted';
};

/**
 * Get cookie preferences
 * @returns {string} - 'all', 'essential', or null
 */
export const getCookiePreferences = () => {
  return getCookie('jcr_cookie_preferences') || 'essential';
};

/**
 * Check if non-essential cookies are allowed
 * @returns {boolean} - True if non-essential cookies are allowed
 */
export const canUseNonEssentialCookies = () => {
  const preferences = getCookiePreferences();
  return preferences === 'all';
};

/**
 * Check if analytics cookies are allowed
 * @returns {boolean} - True if analytics cookies are allowed
 */
export const canUseAnalyticsCookies = () => {
  return canUseNonEssentialCookies();
};

/**
 * Set a cookie only if consent allows it
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration
 * @param {boolean} essential - Whether this is an essential cookie (default: false)
 * @returns {boolean} - True if cookie was set, false if consent was not given
 */
export const setCookieWithConsent = (name, value, days = 365, essential = false) => {
  // Always allow essential cookies
  if (essential) {
    setCookie(name, value, days);
    return true;
  }
  
  // Check consent for non-essential cookies
  if (canUseNonEssentialCookies()) {
    setCookie(name, value, days);
    return true;
  }
  
  return false;
};


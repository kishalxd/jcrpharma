import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCookie, setCookie } from '../utils/cookieUtils';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent cookie exists
    const consent = getCookie('jcr_cookie_consent');
    
    if (!consent) {
      // Show banner after a small delay for smooth animation
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleAccept = () => {
    // Set consent cookie for 365 days (1 year)
    setCookie('jcr_cookie_consent', 'accepted', 365);
    setCookie('jcr_cookie_preferences', 'all', 365);
    hideBanner();
  };

  const handleReject = () => {
    // Set consent cookie as rejected, only essential cookies allowed
    setCookie('jcr_cookie_consent', 'rejected', 365);
    setCookie('jcr_cookie_preferences', 'essential', 365);
    hideBanner();
  };

  const hideBanner = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Content */}
            <div className="flex-1">
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. 
                By clicking "Accept All", you consent to our use of cookies. You can also choose to accept only essential cookies 
                or learn more about our{' '}
                <Link 
                  to="/cookies" 
                  className="text-brand-blue hover:underline font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Don't close banner when clicking the link
                  }}
                >
                  cookie policy
                </Link>
                .
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={handleReject}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
              >
                Essential Only
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-full hover:bg-opacity-90 transition-all duration-200 whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;


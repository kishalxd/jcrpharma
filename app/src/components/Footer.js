import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Footer = () => {
  // Newsletter subscription state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Newsletter subscription handler
  const handleNewsletterSignup = async (e) => {
    e.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterMessage('Please enter a valid email address.');
      setTimeout(() => setNewsletterMessage(''), 5000);
      return;
    }

    setNewsletterLoading(true);
    setNewsletterMessage('');

    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: newsletterEmail.toLowerCase().trim(),
            source: 'website'
          }
        ])
        .select();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setNewsletterMessage('This email is already subscribed to our newsletter.');
        } else {
          throw error;
        }
      } else {
        setNewsletterMessage('Thank you for subscribing! You\'ll receive our latest updates.');
        setNewsletterEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterMessage('Something went wrong. Please try again later.');
    }

    setNewsletterLoading(false);
    setTimeout(() => {
      setNewsletterMessage('');
    }, 5000);
  };

  return (
    <footer className="bg-brand-blue text-white">
      {/* Main Footer Content */}
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              Stay updated with life sciences opportunities
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Subscribe to our newsletter for the latest job openings, industry insights, and career development tips in biometrics and life sciences data.
            </p>
            
            {/* Email Signup */}
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mb-4">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={newsletterLoading}
                className="flex-1 px-5 py-3 rounded-full bg-transparent border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-white/50 text-sm disabled:opacity-50"
                required
              />
              <button 
                type="submit"
                disabled={newsletterLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-8 py-3 rounded-full transition-all duration-300 font-medium text-sm disabled:cursor-not-allowed"
              >
                {newsletterLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>
            
            {/* Newsletter Message */}
            {newsletterMessage && (
              <div className={`text-sm mb-4 ${
                newsletterMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'
              }`}>
                {newsletterMessage}
              </div>
            )}
            
            <p className="text-gray-400 text-sm">
              By clicking Sign Up you're confirming that you agree with our Terms and Conditions.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {/* Logo */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <img 
                  src="/jcr_white_transparent.png" 
                  alt="JCR Pharma" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                Specialised recruitment for life sciences data and biometrics professionals across global markets.
              </p>
            </div>

            {/* Column One - For Employers */}
            <div>
              <h4 className="text-white font-medium mb-6">For Employers</h4>
              <ul className="space-y-4">
                <li><a href="/employers" className="text-gray-300 hover:text-white transition-colors text-sm">Post a Job</a></li>
                <li><a href="/specialisms" className="text-gray-300 hover:text-white transition-colors text-sm">Specialisms</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="/hire-talent" className="text-gray-300 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Column Two - For Candidates */}
            <div>
              <h4 className="text-white font-medium mb-6">For Candidates</h4>
              <ul className="space-y-4">
                <li><a href="/jobs" className="text-gray-300 hover:text-white transition-colors text-sm">Browse Jobs</a></li>
                <li><a href="/candidates" className="text-gray-300 hover:text-white transition-colors text-sm">Upload CV</a></li>
                <li><a href="/blogs" className="text-gray-300 hover:text-white transition-colors text-sm">Blogs</a></li>
                <li><a href="/specialisms" className="text-gray-300 hover:text-white transition-colors text-sm">Specialisms</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-white font-medium mb-6">Follow us</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.facebook.com/share/16cRTXXnJq/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/jcrpharmaltd/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://x.com/JCRPharma" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@JCRPharma" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Youtube
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/jcr-pharma/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/20 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 JCR Pharma. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

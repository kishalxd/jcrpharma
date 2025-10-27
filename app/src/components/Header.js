import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef(null);
  const location = useLocation();

  // Navigation items with their paths
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/specialisms', label: 'Specialisms' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/employers', label: 'Employers' },
    { path: '/candidates', label: 'Candidates' },
    { path: '/about', label: 'About Us' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Trigger after 100px of scroll
    };

    const handleResize = () => {
      // Recalculate indicator position on window resize
      if (navRef.current) {
        const activeNavItem = navRef.current.querySelector(`[data-path="${location.pathname}"]`);
        if (activeNavItem) {
          // Force reflow
          void navRef.current.offsetHeight;
          
          const navRect = navRef.current.getBoundingClientRect();
          const itemRect = activeNavItem.getBoundingClientRect();
          setActiveIndicator({
            left: itemRect.left - navRect.left,
            width: itemRect.width
          });
        }
      }
    };

    const handleTransitionEnd = () => {
      // Recalculate after CSS transitions complete
      setTimeout(handleResize, 10);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Listen for transition end events on the header
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerElement.addEventListener('transitionend', handleTransitionEnd);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (headerElement) {
        headerElement.removeEventListener('transitionend', handleTransitionEnd);
      }
    };
  }, [location.pathname]);

  // Update active indicator position when location changes
  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (navRef.current) {
        const activeNavItem = navRef.current.querySelector(`[data-path="${location.pathname}"]`);
        if (activeNavItem) {
          // Force a reflow to ensure accurate measurements
          void navRef.current.offsetHeight;
          
          const navRect = navRef.current.getBoundingClientRect();
          const itemRect = activeNavItem.getBoundingClientRect();
          setActiveIndicator({
            left: itemRect.left - navRect.left,
            width: itemRect.width
          });
        }
      }
    };

    // Use requestAnimationFrame for more accurate timing
    const rafId = requestAnimationFrame(() => {
      updateIndicatorPosition();
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname, isScrolled]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const isActiveLink = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClasses = (path) => {
    const baseClasses = "text-gray-700 hover:text-brand-blue transition-all duration-300 font-medium whitespace-nowrap relative group pb-2 px-3 py-2";
    const activeClasses = "text-brand-blue";
    return isActiveLink(path) ? `${baseClasses} ${activeClasses}` : baseClasses;
  };

  // Check if we're on a form page
  const isFormPage = location.pathname === '/find-jobs' || location.pathname === '/hire-talent';

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-500 ease-in-out ${
      isScrolled ? 'shadow-lg border-b border-gray-300 backdrop-blur-sm bg-white/95' : 'shadow-sm border-b border-gray-200'
    }`}>
      <div className={`mx-auto px-6 py-3 transition-all duration-500 ease-in-out ${
        isScrolled ? 'max-w-[80%]' : 'container'
      }`}>
        {isFormPage ? (
          // Form page header layout
          <div className="flex items-center justify-between">
            {/* Left Side - Back Button and Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-brand-blue flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <img 
                src="/logo_transparent.png" 
                alt="JCR Logo" 
                className="h-8 w-auto"
              />
            </div>

            {/* Center Content - Title */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-light text-gray-900 text-center">
                {location.pathname === '/find-jobs' ? 'Apply for Position' : 'Hire Talent'}
              </h1>
            </div>

            {/* Right Spacer (to balance the layout) */}
            <div className="w-32"></div>
          </div>
        ) : (
          // Regular page header layout
          <div className="grid grid-cols-3 items-center">
            {/* Logo */}
            <div className="flex justify-start">
              <Link to="/" className="flex items-center">
                <img 
                  src="/logo_transparent.png" 
                  alt="JCR Logo" 
                  className={`w-auto transition-all duration-500 ease-in-out ${
                    isScrolled ? 'h-8' : 'h-10'
                  }`}
                />
              </Link>
            </div>
            
            {/* Navigation - Centered with fluid indicator */}
            <nav 
              ref={navRef}
              className={`hidden md:flex items-center justify-center relative transition-all duration-500`}
              style={{ gap: isScrolled ? '4px' : '8px' }}
            >
              {/* Fluid background indicator */}
              <div 
                className="absolute bottom-0 rounded-full transition-all duration-700 ease-out transform"
                style={{
                  left: `${activeIndicator.left}px`,
                  width: `${activeIndicator.width}px`,
                  height: '3px',
                  background: 'linear-gradient(90deg, #001f3e, #002a54, #001f3e)',
                  boxShadow: '0 0 20px rgba(0, 31, 62, 0.4), 0 0 40px rgba(0, 31, 62, 0.2)',
                  borderRadius: '50px',
                  opacity: activeIndicator.width > 0 ? 1 : 0
                }}
              >
                {/* Liquid ripple effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 rounded-full animate-pulse"></div>
              </div>

              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  data-path={item.path}
                  className={getLinkClasses(item.path)}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Hover ripple effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue/10 via-brand-blue/15 to-brand-blue/10 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"></div>
                </Link>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className={`flex items-center justify-end transition-all duration-500 ${
              isScrolled ? 'space-x-2' : 'space-x-4'
            }`}>
              {user ? (
                <div className={`flex items-center transition-all duration-500 ${
                  isScrolled ? 'space-x-2' : 'space-x-4'
                }`}>
                  <Link
                    to="/hire-talent"
                    className={`text-gray-700 hover:text-brand-blue transition-colors font-medium ${
                      isScrolled ? 'hidden lg:block' : ''
                    }`}
                  >
                    Hire talent
                  </Link>
                  <Link
                    to="/find-jobs"
                    className={`bg-brand-blue hover:bg-blue-700 text-white rounded-full transition-all duration-300 font-medium ${
                      isScrolled ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'
                    }`}
                  >
                    Find Jobs
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center text-gray-700 hover:text-brand-blue transition-colors ${
                        isScrolled ? 'ml-2 space-x-1' : 'ml-4 space-x-2'
                      }`}
                    >
                      <div className={`bg-brand-blue rounded-full flex items-center justify-center ${
                        isScrolled ? 'w-7 h-7' : 'w-8 h-8'
                      }`}>
                        <span className="text-sm font-medium text-white">
                          {user.user_metadata?.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className={`font-medium ${isScrolled ? 'hidden' : 'hidden sm:block'}`}>
                        {user.user_metadata?.firstName || 'User'}
                      </span>
                      <svg className={`fill-none stroke-current ${isScrolled ? 'w-3 h-3 hidden' : 'w-4 h-4'}`} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`flex items-center transition-all duration-500 ${
                  isScrolled ? 'space-x-2' : 'space-x-4'
                }`}>
                  <Link
                    to="/hire-talent"
                    className={`text-gray-700 hover:text-brand-blue transition-colors font-medium ${
                      isScrolled ? 'hidden lg:block' : ''
                    }`}
                  >
                    Hire talent
                  </Link>
                  <Link
                    to="/find-jobs"
                    className={`bg-brand-blue hover:bg-blue-700 text-white rounded-full transition-all duration-300 font-medium ${
                      isScrolled ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'
                    }`}
                  >
                    Find Jobs
                  </Link>
                </div>
              )}
              
              {/* Discreet Admin Access */}
              <Link
                to="/admin-login"
                className="text-xs text-gray-400 hover:text-gray-600 opacity-50 hover:opacity-100 transition-all duration-300"
                title="Admin Access"
              >
                •
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
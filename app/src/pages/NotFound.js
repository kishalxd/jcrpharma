import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const NotFound = () => {
  const navigate = useNavigate();

  // Set SEO metadata
  useSEO(
    '404 - Page Not Found',
    'The page you are looking for could not be found. Return to JCR Pharma homepage or browse our jobs, blogs, and services.'
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="mb-8">
              <h1 className="text-9xl md:text-[12rem] font-light mb-4 leading-none opacity-20">
                404
              </h1>
              <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
                Page Not Found
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-16 h-16 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Don't worry, let's get you back on track. Here are some helpful links to explore:
              </p>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <button
                onClick={() => navigate('/')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Home
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Return to our homepage
                </p>
              </button>

              <button
                onClick={() => navigate('/jobs')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Jobs
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Browse available positions
                </p>
              </button>

              <button
                onClick={() => navigate('/blogs')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Blog
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Read our latest insights
                </p>
              </button>

              <button
                onClick={() => navigate('/specialisms')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Specialisms
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Explore our expertise areas
                </p>
              </button>

              <button
                onClick={() => navigate('/employers')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Employers
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Find talent for your team
                </p>
              </button>

              <button
                onClick={() => navigate('/candidates')}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 text-left hover:border-brand-blue hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg 
                    className="w-6 h-6 text-brand-blue group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-blue transition-colors">
                    Candidates
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Explore career opportunities
                </p>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Go Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-brand-blue hover:bg-blue-900 text-white px-8 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you believe this is an error, please contact us and we'll be happy to assist you.
            </p>
            <a 
              href="mailto:general@jcrpharma.co.uk" 
              className="text-brand-blue hover:text-blue-700 font-medium inline-flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              general@jcrpharma.co.uk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;

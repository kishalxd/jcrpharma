import React, { useState } from 'react';
import { useAdmin } from '../components/AdminContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, isAdminAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/admin');
      }
    }
  }, [isAdminAuthenticated, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = adminLogin(username, password);
    
    if (result.success) {
      // Check if there's a redirect URL
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/admin');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="mb-12">
            <img 
              src="/jcr_logo.jpg" 
              alt="JCR Logo" 
              className="h-20 w-auto mx-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-brand-blue mb-4">
            Admin Portal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Content Management System
          </p>
          <p className="text-sm text-gray-500">
            Restricted Access - Authorized Personnel Only
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-brand-blue">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/jcr_logo.jpg" 
              alt="JCR Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
            <p className="text-blue-100">Content Management System</p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-blue-100">Please sign in to your admin account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-blue-300 bg-white focus:border-white outline-none rounded-lg"
                placeholder="Enter admin username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-blue-300 bg-white focus:border-white outline-none rounded-lg"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-brand-blue py-3 px-4 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Access Admin Portal'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-white hover:text-blue-100 text-sm font-medium"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 
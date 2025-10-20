import React from 'react';
import { useAdmin } from './AdminContext';
import AdminLogin from '../pages/AdminLogin';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-brand-blue font-medium">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return children;
};

export default AdminProtectedRoute; 
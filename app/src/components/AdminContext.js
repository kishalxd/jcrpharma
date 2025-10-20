import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext({});

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for stored admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession === 'authenticated') {
      setIsAdminAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const adminLogin = (username, password) => {
    // Hardcoded admin credentials
    if (username === 'captainprice' && password === '123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminSession', 'authenticated');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid admin credentials' };
    }
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminSession');
  };

  const value = {
    isAdminAuthenticated,
    loading,
    adminLogin,
    adminLogout
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { AdminProvider } from './components/AdminContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Home from './pages/Home';
import Specialisms from './pages/Specialisms';
import Jobs from './pages/Jobs';
import Blog from './pages/Blog';
import Employers from './pages/Employers';
import Candidates from './pages/Candidates';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import CandidateApplication from './pages/CandidateApplication';
import ClientHiring from './pages/ClientHiring';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HiringRequestDetail from './pages/HiringRequestDetail';
import EmployeeApplicationDetail from './pages/EmployeeApplicationDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="dashboard" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/edit-pages" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="edit-pages" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/edit-pages/:pageName" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="edit-pages" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="blogs" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/employee-applications" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="employee-applications" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/hiring-requests" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="hiring-requests" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/job-board" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="job-board" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/newsletter-subscriptions" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="newsletter-subscriptions" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="settings" />
                </AdminProtectedRoute>
              } 
            />
            {/* Legacy admin routes - redirect to new structure */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="dashboard" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="dashboard" />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/hiring/:id" 
              element={
                <AdminProtectedRoute>
                  <HiringRequestDetail />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/employee-application/:id" 
              element={
                <AdminProtectedRoute>
                  <EmployeeApplicationDetail />
                </AdminProtectedRoute>
              } 
            />
            
            {/* Regular App Routes */}
            <Route 
              path="/*" 
              element={
                <div className="App">
                  <Header />
                  <main className="pt-14">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/specialisms" element={<Specialisms />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/blogs" element={<Blog />} />
                      <Route path="/blogs/:id" element={<Blog />} />
                      <Route path="/employers" element={<Employers />} />
                      <Route path="/candidates" element={<Candidates />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/find-jobs" element={<CandidateApplication />} />
                      <Route path="/hire-talent" element={<ClientHiring />} />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </main>
                </div>
              } 
            />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

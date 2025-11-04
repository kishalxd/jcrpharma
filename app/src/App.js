import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { AdminProvider } from './components/AdminContext';
import Header from './components/Header';
import CookieConsent from './components/CookieConsent';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { StructuredData, generateOrganizationSchema, getBreadcrumbsForPath, generateBreadcrumbSchema } from './components/StructuredData';
import Home from './pages/Home';
import Specialisms from './pages/Specialisms';
import Jobs from './pages/Jobs';
import Blog from './pages/Blog';
import Employers from './pages/Employers';
import Candidates from './pages/Candidates';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
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
import JobView from './pages/JobView';
import JobApply from './pages/JobApply';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';


// ScrollToTop component that scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component to add structured data to all pages
function StructuredDataWrapper({ children }) {
  const location = useLocation();
  
  // Skip structured data for admin pages
  const isAdminPage = location.pathname.startsWith('/admin') || 
                     location.pathname === '/admin-login' ||
                     location.pathname.startsWith('/hiring/') ||
                     location.pathname.startsWith('/employee-application/');
  
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Get breadcrumbs for current path
  const breadcrumbs = getBreadcrumbsForPath(location.pathname);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      <StructuredData data={organizationSchema} />
      {breadcrumbs.length > 1 && <StructuredData data={breadcrumbSchema} />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
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
              path="/admin/testimonials" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard activeTab="testimonials" />
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
                  <Navigate to="/admin/edit-pages" replace />
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
            
            {/* Sitemap Route - Must be before catch-all */}
            <Route path="/sitemap.xml" element={<Sitemap />} />
            
            {/* Regular App Routes */}
            <Route 
              path="/*" 
              element={
                <StructuredDataWrapper>
                  <div className="App">
                    <Header />
                    <CookieConsent />
                    <main className="pt-14">
                      <Routes>
                        <Route path="/" element={<Home />} />
                      <Route path="/specialisms" element={<Specialisms />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/jobs/view/:id" element={<JobView />} />
                      <Route path="/jobs/apply/:id" element={<JobApply />} />
                      <Route path="/blogs" element={<Blog />} />
                      <Route path="/blog/:slug" element={<Blog />} />
                      {/* Legacy route support for backwards compatibility */}
                      <Route path="/blogs/:id" element={<Blog />} />
                      <Route path="/employers" element={<Employers />} />
                      <Route path="/candidates" element={<Candidates />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/cookies" element={<Cookies />} />
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
                      {/* 404 - Catch all route - must be last */}
                      <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </StructuredDataWrapper>
              } 
            />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth pages
import InvestorLogin from './pages/auth/investor/InvestorLogin';
import InvestorSignup from './pages/auth/investor/InvestorSignup';
import BorrowerLogin from './pages/auth/borrower/BorrowerLogin';
import BorrowerSignup from './pages/auth/borrower/BorrowerSignup';
import AdminLogin from './pages/auth/admin/AdminLogin';
import AdminSignup from './pages/auth/admin/AdminSignup';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard pages
import InvestorDashboard from './pages/investor/Dashboard';
import BorrowerDashboard from './pages/borrower/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

// Layout components
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';

// Auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/investor/login" element={<InvestorLogin />} />
            <Route path="/investor/signup" element={<InvestorSignup />} />
            <Route path="/borrower/login" element={<BorrowerLogin />} />
            <Route path="/borrower/signup" element={<BorrowerSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          
          {/* Protected routes */}
          <Route path="/investor/*" element={
            <ProtectedRoute role="investor">
              <Routes>
                <Route path="dashboard" element={<InvestorDashboard />} />
                <Route path="*" element={<Navigate to="/investor/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          <Route path="/borrower/*" element={
            <ProtectedRoute role="borrower">
              <Routes>
                <Route path="dashboard" element={<BorrowerDashboard />} />
                <Route path="*" element={<Navigate to="/borrower/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
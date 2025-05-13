import { Outlet, useLocation } from 'react-router-dom';
import { ChevronsLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();
  
  // Determine which auth flow we're in based on the URL
  const getAuthType = () => {
    const path = location.pathname;
    if (path.includes('/investor')) return 'investor';
    if (path.includes('/borrower')) return 'borrower';
    if (path.includes('/admin')) return 'admin';
    return '';
  };

  const authType = getAuthType();
  
  // Determine background gradient based on auth type
  const getGradientClass = () => {
    switch (authType) {
      case 'investor':
        return 'from-blue-600 to-blue-800';
      case 'borrower':
        return 'from-orange-500 to-orange-700';
      case 'admin':
        return 'from-purple-600 to-purple-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const renderAuthTypeIcon = () => {
    switch (authType) {
      case 'investor':
        return '💼';
      case 'borrower':
        return '🏦';
      case 'admin':
        return '🔑';
      default:
        return '👤';
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - only on desktop */}
      <div className={`hidden md:flex md:w-1/3 lg:w-1/4 bg-gradient-to-b ${getGradientClass()} text-white p-8 flex-col justify-between`}>
        <div>
          <Link to="/" className="flex items-center text-white mb-12">
            <ChevronsLeft className="mr-2" size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="mb-8">
            <div className="text-5xl mb-4">{renderAuthTypeIcon()}</div>
            <h1 className="text-2xl font-bold mb-2">
              {authType ? `${capitalizeFirstLetter(authType)} Portal` : 'Authentication'}
            </h1>
            <p className="text-white/80">
              {authType === 'investor' && 'Securely access your investment dashboard and manage your portfolio.'}
              {authType === 'borrower' && 'Apply for loans and manage your borrowing activities with ease.'}
              {authType === 'admin' && 'Admin access to manage platform activities and users.'}
              {!authType && 'Secure access to your account.'}
            </p>
          </div>
        </div>
        
        <div className="text-sm text-white/60">
          <p>© {new Date().getFullYear()} Investment Platform</p>
          <p>All rights reserved</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Mobile back link */}
          <div className="md:hidden mb-8">
            <Link to="/" className="flex items-center text-gray-600">
              <ChevronsLeft className="mr-2" size={20} />
              <span>Back to Home</span>
            </Link>
          </div>
          
          {/* Auth form */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
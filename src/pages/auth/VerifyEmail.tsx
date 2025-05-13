import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, RefreshCcw } from 'lucide-react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const VerifyEmail = () => {
  const { verifyEmail, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Get email from location state or use empty string as fallback
  const email = location.state?.email || '';
  
  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  
  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }
    
    setIsLoading(true);
    try {
      await verifyEmail(email, otpString);
      toast.success('Email verified successfully!');
      
      // Determine the role from the email domain (simplified approach)
      let role = 'investor';
      if (email.includes('admin')) {
        role = 'admin';
      } else if (email.includes('borrower')) {
        role = 'borrower';
      }
      
      navigate(`/${role}/login`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email address is missing. Please go back to signup.');
      return;
    }
    
    setIsResending(true);
    try {
      await resendOtp(email);
      toast.success('New OTP code sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Card className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to
          {email ? (
            <span className="font-medium"> {email}</span>
          ) : (
            <span> your email address</span>
          )}
        </p>
      </div>
      
      <div className="mb-8">
        <label htmlFor="otp-0" className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter the 6-digit code
        </label>
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoComplete="off"
            />
          ))}
        </div>
      </div>
      
      <Button 
        type="button" 
        fullWidth 
        isLoading={isLoading}
        onClick={handleVerify}
      >
        Verify Email
      </Button>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        <Button 
          type="button" 
          variant="outline" 
          isLoading={isResending}
          onClick={handleResendOtp}
          icon={<RefreshCcw size={16} />}
        >
          Resend Code
        </Button>
      </div>
    </Card>
  );
};

export default VerifyEmail;
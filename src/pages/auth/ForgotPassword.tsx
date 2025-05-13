import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setIsSuccess(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Request failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSuccess) {
    return (
      <Card className="w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
          <p className="text-gray-600 mt-2">
            We've sent password reset instructions to your email address. Please check your inbox.
          </p>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-500">
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="text-gray-600 mt-1">
          Enter your email and we'll send you instructions to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          icon={<Mail size={18} />}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />
        
        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Send Reset Instructions
        </Button>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/investor/login" className="font-medium text-blue-600 hover:text-blue-500">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default ForgotPassword;
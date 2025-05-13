import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyRound, Lock } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(token, data.password);
      toast.success('Password reset successful! You can now log in with your new password.');
      navigate('/investor/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!token) {
    return (
      <Card className="w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600">
            The password reset link is invalid or has expired. Please request a new password reset.
          </p>
          <Button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="mt-6"
          >
            Request New Reset Link
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
        <p className="text-gray-600 mt-1">Create a new password for your account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          icon={<KeyRound size={18} />}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must include uppercase, lowercase, number and special character',
            },
          })}
          error={errors.password?.message}
        />
        
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
        
        <div className="mt-6">
          <Button type="submit" fullWidth isLoading={isLoading}>
            Reset Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResetPassword;
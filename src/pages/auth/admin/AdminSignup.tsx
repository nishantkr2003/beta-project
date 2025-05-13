import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, User, KeyRound, Phone, ShieldCheck } from 'lucide-react';

import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adminKey: string;
  password: string;
  confirmPassword: string;
}

const AdminSignup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        adminKey: data.adminKey,
        password: data.password,
      }, 'admin');
      
      toast.success('Admin account created! Please verify your email.');
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Signup</h2>
        <p className="text-gray-600 mt-1">Create your admin account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="John"
            icon={<User size={18} />}
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={errors.firstName?.message}
          />
          
          <Input
            label="Last Name"
            placeholder="Doe"
            icon={<User size={18} />}
            {...register('lastName', {
              required: 'Last name is required',
            })}
            error={errors.lastName?.message}
          />
        </div>
        
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
        
        <Input
          label="Phone Number"
          placeholder="+1 (555) 123-4567"
          icon={<Phone size={18} />}
          {...register('phone', {
            required: 'Phone number is required',
          })}
          error={errors.phone?.message}
        />
        
        <Input
          label="Admin Access Key"
          type="password"
          placeholder="Enter the admin access key"
          icon={<ShieldCheck size={18} />}
          {...register('adminKey', {
            required: 'Admin key is required',
          })}
          error={errors.adminKey?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<KeyRound size={18} />}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password?.message}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<KeyRound size={18} />}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
        
        <div className="mt-4 mb-6">
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          variant="secondary"
        >
          Create Admin Account
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an admin account?{' '}
            <Link to="/admin/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in instead
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
};

export default AdminSignup;
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              icon ? 'pl-10' : 'pl-3'
            } pr-3 py-2 border ${
              error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            } ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" id={props.id ? `${props.id}-error` : undefined}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
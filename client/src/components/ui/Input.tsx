import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, type = 'text', className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            className={`
              w-full bg-white border rounded-xl py-3 text-slate-800 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
              transition-all duration-200
              ${error ? 'border-red-400 focus:ring-red-300/40 focus:border-red-400' : 'border-slate-200'}
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${isPassword ? 'pr-12' : 'pr-4'}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs font-medium mt-0.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

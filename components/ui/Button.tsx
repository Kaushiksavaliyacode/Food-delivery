
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 bouncy-click disabled:opacity-50 disabled:cursor-not-allowed rounded-xl";
  
  const variants = {
    primary: "bg-[#E23744] text-white shadow-lg hover:brightness-95",
    secondary: "bg-slate-900 text-white shadow-md",
    outline: "border border-slate-200 bg-white text-slate-900",
    ghost: "text-slate-500 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600",
    success: "bg-green-50 text-green-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[7px] rounded-lg",
    md: "px-4 py-2.5 text-[9px] rounded-xl",
    lg: "px-6 py-3.5 text-[11px] rounded-2xl",
    xl: "px-8 py-4.5 text-[13px] rounded-3xl"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-1.5">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

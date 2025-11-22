
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  leftIcon,
  disabled,
  ...props
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-180 ease-out focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm focus:ring-primary/18 border border-transparent",
    secondary: "bg-surface hover:bg-black/5 dark:hover:bg-white/5 text-text border border-border shadow-sm focus:ring-white/5",
    ghost: "bg-transparent hover:bg-primary/10 text-primary border border-transparent hover:underline decoration-primary/30 focus:ring-primary/10",
    danger: "bg-danger hover:bg-red-600 text-white shadow-sm focus:ring-danger/20 border border-transparent"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm rounded-sm",
    md: "h-[44px] px-5 text-base rounded-md", 
    lg: "h-[52px] px-6 text-lg rounded-md",
    icon: "h-[40px] w-[40px] p-0 rounded-md justify-center"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
    </button>
  );
};

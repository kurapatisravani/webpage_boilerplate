// src/components/atoms/Button/Button.tsx
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean; // Example for loading state
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out inline-flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary disabled:bg-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary-light focus:ring-secondary disabled:bg-secondary/50",
    outline: "border border-primary text-primary hover:bg-primary/10 focus:ring-primary disabled:text-primary/50 disabled:border-primary/50",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary disabled:text-primary/50",
    danger: "bg-error text-white hover:bg-error/80 focus:ring-error disabled:bg-error/50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm", // Use --text-sm CSS var if defined
    md: "px-4 py-2 text-base", // Use --text-base
    lg: "px-6 py-3 text-lg",   // Use --text-lg
  };

  const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${loadingStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
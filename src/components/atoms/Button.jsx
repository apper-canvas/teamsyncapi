import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-sm",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-900",
    accent: "bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-600 hover:to-primary-600 text-white shadow-sm",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    ghost: "hover:bg-gray-100 text-gray-900"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <ApperIcon name={leftIcon} className="w-4 h-4 mr-2" />}
      {children}
      {!loading && rightIcon && <ApperIcon name={rightIcon} className="w-4 h-4 ml-2" />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
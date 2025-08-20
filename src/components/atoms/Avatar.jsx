import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Avatar = ({ 
  className,
  src,
  alt,
  fallback,
  size = "md",
  ...props 
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback ? (
        <span className={cn("font-medium text-primary-700", textSizes[size])}>
          {fallback}
        </span>
      ) : (
        <ApperIcon name="User" className={cn("text-primary-600", size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-6 h-6")} />
      )}
    </div>
  );
};

export default Avatar;
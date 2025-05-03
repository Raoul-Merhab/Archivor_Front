"use client";

import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm",
    outline: "bg-transparent hover:bg-gray-50 text-blue-600 border border-blue-600",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg"
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button 
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
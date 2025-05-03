"use client";

import React from 'react';

export default function Card({ 
  children, 
  title, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
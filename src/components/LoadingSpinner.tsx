"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-2 border-gray-700 rounded-full animate-spin`}>
          <div className={`absolute inset-0 border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}></div>
        </div>
        
        {/* Pulsing dots */}
        <div className="absolute -inset-2 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className={`w-1 h-1 ${color === 'blue' ? 'bg-blue-500' : color === 'white' ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-1 h-1 ${color === 'blue' ? 'bg-blue-500' : color === 'white' ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-1 h-1 ${color === 'blue' ? 'bg-blue-500' : color === 'white' ? 'bg-white' : 'bg-gray-400'} rounded-full animate-pulse`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
      
      {text && (
        <p className={`text-sm ${color === 'white' ? 'text-white' : 'text-gray-400'} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
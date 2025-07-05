"use client";

import React, { useState } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  tooltip?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'purple';
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  tooltip,
  position = 'bottom-right',
  size = 'md',
  color = 'blue'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  };

  const defaultIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed ${positionClasses[position]} ${sizeClasses[size]} ${colorClasses[color]}
          rounded-full shadow-2xl text-white font-bold
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-3xl
          focus:outline-none focus:ring-4 focus:ring-blue-500/30
          z-50 group
        `}
      >
        <div className={`transition-transform duration-200 ${isHovered ? 'scale-110 rotate-90' : ''}`}>
          {icon || defaultIcon}
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
      </button>

      {/* Tooltip */}
      {tooltip && isHovered && (
        <div className={`
          fixed ${positionClasses[position]} z-40
          ${position.includes('right') ? 'mr-20' : 'ml-20'}
          ${position.includes('bottom') ? 'mb-2' : 'mt-2'}
          bg-gray-900 text-white text-sm px-3 py-2 rounded-lg
          shadow-lg border border-gray-700
          animate-bounce-in
        `}>
          {tooltip}
          <div className={`
            absolute w-2 h-2 bg-gray-900 transform rotate-45
            ${position.includes('right') ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'}
            ${position.includes('bottom') ? 'bottom-2' : 'top-2'}
          `}></div>
        </div>
      )}
    </>
  );
};

export default FloatingActionButton;
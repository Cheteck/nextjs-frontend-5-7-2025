"use client";

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'blue',
  showLabel = false,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const gradientClasses = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-medium text-white">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-700/30 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${gradientClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${clampedProgress}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
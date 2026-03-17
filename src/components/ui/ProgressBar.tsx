import React from 'react';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar = ({ percentage, size = 'md' }: ProgressBarProps) => {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={`w-full overflow-hidden rounded-full bg-gray-100 ${heights[size]}`}>
        <div
          className="gradient-bg h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      <div className="mt-1 flex justify-end">
        <span className="text-[10px] font-bold text-text-secondary">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;

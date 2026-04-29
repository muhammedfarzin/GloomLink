import React from 'react';

interface LoadingWidgetProps {
  fullScreen?: boolean;
}

const LoadingWidget: React.FC<LoadingWidgetProps> = ({ fullScreen }) => {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen w-full bg-background' : 'h-full w-full min-h-[200px]'}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        
        {/* Middle reverse spinning ring */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-l-primary/60 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* Inner pulsing dot */}
        <div className="w-5 h-5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50"></div>
      </div>
    </div>
  );
};

export default LoadingWidget;

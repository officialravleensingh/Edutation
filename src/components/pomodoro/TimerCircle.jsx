
import { ReactNode } from "react";

export function TimerCircle({ children, progress }) {
  // Calculate rotation for progress display
  const rotation = progress * 3.6; // Convert percentage to degrees (100% = 360 degrees)
  
  return (
    <div className="relative w-64 h-64 md:w-72 md:h-72">
      {/* Background Circle */}
      <div className="absolute inset-0 rounded-full bg-muted dark:bg-slate-800"></div>
      
      {/* Progress Circle */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {/* First Half of Progress */}
        {rotation <= 180 ? (
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)',
              background: 'linear-gradient(90deg, #38B2AC 0%, #3B82F6 100%)',
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'bottom left'
            }}
          ></div>
        ) : (
          <>
            {/* First Half Complete */}
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)',
                background: 'linear-gradient(90deg, #38B2AC 0%, #3B82F6 100%)',
                transform: 'rotate(180deg)',
                transformOrigin: 'bottom left'
              }}
            ></div>
            {/* Second Half of Progress */}
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%, 50% 0%)',
                background: 'linear-gradient(90deg, #38B2AC 0%, #3B82F6 100%)',
                transform: `rotate(${rotation - 180}deg)`,
                transformOrigin: 'bottom right'
              }}
            ></div>
          </>
        )}
      </div>
      
      {/* Inner Circle */}
      <div className="absolute inset-[15px] rounded-full bg-card flex items-center justify-center shadow-inner">
        {children}
      </div>
    </div>
  );
}

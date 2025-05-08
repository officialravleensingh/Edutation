
import { ReactNode } from "react";

export function TimerCircle({ children, progress }) {
  const rotation = progress * 3.6; 
  
  return (
    <div className="relative w-64 h-64 md:w-72 md:h-72">
      <div className="absolute inset-0 rounded-full bg-muted dark:bg-slate-800"></div>
      <div className="absolute inset-0 overflow-hidden rounded-full">
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
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)',
                background: 'linear-gradient(90deg, #38B2AC 0%, #3B82F6 100%)',
                transform: 'rotate(180deg)',
                transformOrigin: 'bottom left'
              }}
            ></div>
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
      
      <div className="absolute inset-[15px] rounded-full bg-card flex items-center justify-center shadow-inner">
        {children}
      </div>
    </div>
  );
}

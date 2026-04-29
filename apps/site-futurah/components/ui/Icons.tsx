import React from 'react';

export const PointerIcon: React.FC<{ className?: string; rotation?: number }> = ({ 
  className = "", 
  rotation = 0 
}) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ 
      filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.12))',
      transform: `rotate(${rotation}deg)`
    }}
  >
    <path 
      d="M12 4.2C12.5 4.2 12.8 4.4 13.1 5.1L19.8 19.2C20.2 20.1 19.7 20.8 18.8 20.4L12 17.5L5.2 20.4C4.3 20.8 3.8 20.1 4.2 19.2L10.9 5.1C11.2 4.4 11.5 4.2 12 4.2Z" 
      fill="#DCFF69" 
      stroke="#889C00" 
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

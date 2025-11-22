
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="StockMaster Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgb(var(--color-primary))" />
          <stop offset="100%" stopColor="rgb(var(--color-primary-600))" />
        </linearGradient>
      </defs>
      
      {/* Main Cube Shape */}
      <path 
        d="M20 4L4 13V29L20 38L36 29V13L20 4Z" 
        fill="url(#logo-gradient)" 
        fillOpacity="0.15" 
        stroke="url(#logo-gradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Inner Y Construction */}
      <path 
        d="M20 20V38" 
        stroke="url(#logo-gradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M4 13L20 20L36 13" 
        stroke="url(#logo-gradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Stacked detail lines */}
      <path 
        d="M12 17.5L20 24.5L28 17.5" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.7"
      />
      <path 
        d="M12 25.5L20 32.5L28 25.5" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.4"
      />
    </svg>
  );
};

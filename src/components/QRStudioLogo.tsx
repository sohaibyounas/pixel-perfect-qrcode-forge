import React from 'react';

interface QRStudioLogoProps {
  size?: number;
  className?: string;
}

export const QRStudioLogo: React.FC<QRStudioLogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`flex-shrink-0 drop-shadow-sm select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular Teal Background (#287A74) */}
      <circle cx="50" cy="50" r="46" fill="#287A74" />
      
      {/* Stylized Pale Yellow QR Elements (#FFF8B0) */}
      <g fill="#FFF8B0">
        {/* Top-Left Finder Eye */}
        <rect x="23" y="23" width="22" height="22" rx="6" fill="none" stroke="#FFF8B0" strokeWidth="4.5" />
        <rect x="29.5" y="29.5" width="9" height="9" rx="2.5" fill="#FFF8B0" />

        {/* Top-Right Finder Eye */}
        <rect x="55" y="23" width="22" height="22" rx="6" fill="none" stroke="#FFF8B0" strokeWidth="4.5" />
        <rect x="61.5" y="29.5" width="9" height="9" rx="2.5" fill="#FFF8B0" />

        {/* Bottom-Left Finder Eye */}
        <rect x="23" y="55" width="22" height="22" rx="6" fill="none" stroke="#FFF8B0" strokeWidth="4.5" />
        <rect x="29.5" y="61.5" width="9" height="9" rx="2.5" fill="#FFF8B0" />

        {/* Center vertical pill & dots */}
        <circle cx="50" cy="25" r="2.5" />
        <rect x="47.5" y="32" width="5" height="15" rx="2.5" />
        <rect x="55" y="47" width="14" height="5" rx="2.5" />
        
        {/* Bottom right corner data points */}
        <circle cx="25" cy="49" r="2.5" />
        <rect x="47.5" y="57" width="5" height="12" rx="2.5" />
        <path d="M 55 57 H 66 A 4 4 0 0 1 70 61 V 70 H 65 V 63 A 2 2 0 0 0 63 61 H 55 Z" />
        <circle cx="70" cy="50" r="2.5" />
        <circle cx="72" cy="70" r="3" />
      </g>
    </svg>
  );
};

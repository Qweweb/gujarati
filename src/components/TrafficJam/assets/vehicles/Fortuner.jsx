import React from 'react';

const Fortuner = ({ color = '#FFFFFF' }) => {
  // Fortuner is typically white, so if it's white we need to ensure contrast.
  const isWhite = color.toUpperCase() === '#FFFFFF' || color.toUpperCase() === '#FFF';
  const strokeColor = isWhite ? '#D1D5DB' : color;
  
  return (
    <svg viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 6px 10px rgba(0,0,0,0.5))' }}>
      {/* Tires */}
      <rect x="4" y="40" width="12" height="35" rx="3" fill="#111827" />
      <rect x="84" y="40" width="12" height="35" rx="3" fill="#111827" />
      <rect x="4" y="225" width="12" height="35" rx="3" fill="#111827" />
      <rect x="84" y="225" width="12" height="35" rx="3" fill="#111827" />

      {/* Main Body (Longer - 3 cells) */}
      <path d="M 16 20 C 16 5, 84 5, 84 20 L 88 280 C 88 295, 12 295, 12 280 Z" fill={color} stroke={strokeColor} strokeWidth={isWhite ? "1" : "0"} />
      
      {/* Front Chrome Grill */}
      <path d="M 30 10 L 70 10 L 66 18 L 34 18 Z" fill="#9CA3AF" />
      <rect x="42" y="12" width="16" height="4" rx="1" fill="#4B5563" />

      {/* Sleek Headlights */}
      <path d="M 16 16 C 30 10, 30 10, 35 15 L 18 24 Z" fill="#E5E7EB" />
      <circle cx="22" cy="18" r="2.5" fill="#FEF08A" />
      <path d="M 84 16 C 70 10, 70 10, 65 15 L 82 24 Z" fill="#E5E7EB" />
      <circle cx="78" cy="18" r="2.5" fill="#FEF08A" />

      {/* Hood */}
      <path d="M 22 28 L 78 28 L 72 75 L 28 75 Z" fill="#000000" opacity="0.08" />
      <path d="M 35 28 L 65 28 L 60 70 L 40 70 Z" fill="#000000" opacity="0.05" /> {/* hood contour */}

      {/* Windshield - Sloped back */}
      <path d="M 18 80 C 40 70, 60 70, 82 80 L 76 105 L 24 105 Z" fill="#111827" />
      <path d="M 24 84 C 45 76, 55 76, 76 84 L 70 100 L 30 100 Z" fill="#93C5FD" opacity="0.4" />

      {/* Roof */}
      <rect x="22" y="105" width="56" height="150" rx="4" fill={color} style={{ filter: 'brightness(1.05)' }} stroke={strokeColor} strokeWidth={isWhite ? "1" : "0"} />
      
      {/* Panoramic Sunroof */}
      <rect x="30" y="115" width="40" height="45" rx="4" fill="#111827" />
      <rect x="30" y="165" width="40" height="60" rx="4" fill="#111827" />

      {/* Shark Fin Antenna */}
      <path d="M 48 240 L 52 240 L 50 230 Z" fill="#374151" />

      {/* Side Windows (Continuous look) */}
      <rect x="14" y="102" width="6" height="155" rx="2" fill="#111827" />
      <rect x="80" y="102" width="6" height="155" rx="2" fill="#111827" />
      
      {/* Rear Window */}
      <path d="M 22 258 L 78 258 L 74 275 L 26 275 Z" fill="#111827" />

      {/* Tail lights (Sleek wrap-around) */}
      <path d="M 12 270 C 25 270, 30 270, 35 278 L 12 278 Z" fill="#EF4444" />
      <path d="M 88 270 C 75 270, 70 270, 65 278 L 88 278 Z" fill="#EF4444" />
      
      {/* Chrome bar between tail lights */}
      <rect x="35" y="274" width="30" height="3" fill="#D1D5DB" />

      {/* Side Mirrors */}
      <path d="M 16 84 L 6 84 C 4 84, 4 88, 6 88 L 18 88 Z" fill={color} stroke={strokeColor} strokeWidth={isWhite ? "1" : "0"} />
      <path d="M 84 84 L 94 84 C 96 84, 96 88, 94 88 L 82 88 Z" fill={color} stroke={strokeColor} strokeWidth={isWhite ? "1" : "0"} />
    </svg>
  );
};

export default Fortuner;

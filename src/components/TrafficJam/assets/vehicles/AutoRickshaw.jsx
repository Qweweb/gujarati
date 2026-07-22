import React from 'react';

const AutoRickshaw = ({ color = '#22c55e' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.4))' }}>
    {/* Shadow / Base */}
    <rect x="25" y="30" width="50" height="60" rx="4" fill="#111827" opacity="0.8" />
    
    {/* Body / Cabin Bottom */}
    <path d="M 30 15 L 70 15 L 85 45 L 85 95 L 15 95 L 15 45 Z" fill={color} />
    
    {/* Yellow Top Cabin (Iconic for Indian Rickshaws) */}
    <path d="M 20 40 L 80 40 L 80 95 L 20 95 Z" fill="#FBBF24" />
    
    {/* Canvas Roof */}
    <rect x="22" y="42" width="56" height="48" rx="8" fill="#1F2937" />
    <line x1="22" y1="55" x2="78" y2="55" stroke="#374151" strokeWidth="2" />
    <line x1="22" y1="70" x2="78" y2="70" stroke="#374151" strokeWidth="2" />
    <line x1="22" y1="85" x2="78" y2="85" stroke="#374151" strokeWidth="2" />
    
    {/* Front Mudguard / Wheel cover */}
    <path d="M 40 5 L 60 5 L 65 25 L 35 25 Z" fill={color} />
    
    {/* Windshield */}
    <path d="M 32 28 L 68 28 L 75 40 L 25 40 Z" fill="#60A5FA" opacity="0.6" />
    <path d="M 35 30 L 65 30 L 70 38 L 30 38 Z" fill="#93C5FD" opacity="0.3" /> {/* reflection */}

    {/* Driver Seat/Handlebar area seen through windshield */}
    <rect x="45" y="32" width="10" height="5" rx="1" fill="#111827" />

    {/* Headlight */}
    <circle cx="50" cy="12" r="6" fill="#D1D5DB" />
    <circle cx="50" cy="12" r="4" fill="#FEF08A" />

    {/* Turn signals */}
    <circle cx="35" cy="20" r="3" fill="#F97316" />
    <circle cx="65" cy="20" r="3" fill="#F97316" />

    {/* Side Mirrors */}
    <rect x="12" y="35" width="8" height="4" rx="1" fill="#111827" transform="rotate(-15 12 35)" />
    <rect x="80" y="35" width="8" height="4" rx="1" fill="#111827" transform="rotate(15 80 35)" />

    {/* Rear window cutout in canvas */}
    <rect x="35" y="80" width="30" height="8" rx="2" fill="#000000" opacity="0.5" />
    
    {/* Tail lights */}
    <rect x="25" y="93" width="10" height="4" rx="1" fill="#EF4444" />
    <rect x="65" y="93" width="10" height="4" rx="1" fill="#EF4444" />
  </svg>
);

export default AutoRickshaw;

import React from 'react';

const Swift = ({ color = '#EF4444' }) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))' }}>
    {/* Tires */}
    <rect x="4" y="30" width="10" height="25" rx="3" fill="#111827" />
    <rect x="86" y="30" width="10" height="25" rx="3" fill="#111827" />
    <rect x="4" y="145" width="10" height="25" rx="3" fill="#111827" />
    <rect x="86" y="145" width="10" height="25" rx="3" fill="#111827" />

    {/* Base Body - curvy */}
    <path d="M 16 20 C 16 5, 84 5, 84 20 L 88 160 C 88 190, 12 190, 12 160 Z" fill={color} />
    
    {/* Body Highlight */}
    <path d="M 20 25 C 20 15, 80 15, 80 25 L 84 155 C 84 175, 16 175, 16 155 Z" fill="#FFFFFF" opacity="0.1" />

    {/* Hood lines */}
    <path d="M 25 20 L 30 65" stroke="#000000" strokeWidth="1" opacity="0.2" />
    <path d="M 75 20 L 70 65" stroke="#000000" strokeWidth="1" opacity="0.2" />

    {/* Grill */}
    <path d="M 35 8 C 50 12, 50 12, 65 8 L 70 16 C 50 20, 50 20, 30 16 Z" fill="#111827" />
    
    {/* Headlights - Swept back */}
    <path d="M 16 15 C 25 10, 32 10, 32 15 L 28 25 C 20 25, 16 20, 16 15 Z" fill="#E5E7EB" />
    <circle cx="26" cy="18" r="3" fill="#FEF08A" />
    <path d="M 84 15 C 75 10, 68 10, 68 15 L 72 25 C 80 25, 84 20, 84 15 Z" fill="#E5E7EB" />
    <circle cx="74" cy="18" r="3" fill="#FEF08A" />

    {/* Windshield - Sloped */}
    <path d="M 20 65 C 50 55, 50 55, 80 65 L 76 95 L 24 95 Z" fill="#111827" />
    <path d="M 25 70 C 50 62, 50 62, 75 70 L 72 90 L 28 90 Z" fill="#60A5FA" opacity="0.3" /> {/* glass reflection */}

    {/* Roof */}
    <path d="M 24 95 L 76 95 L 72 155 L 28 155 Z" fill={color} />
    <path d="M 24 95 L 76 95 L 72 155 L 28 155 Z" fill="#000000" opacity="0.1" /> {/* roof shading */}

    {/* Side Windows */}
    <path d="M 16 85 C 16 75, 20 70, 20 70 L 22 95 L 14 95 Z" fill="#111827" />
    <path d="M 84 85 C 84 75, 80 70, 80 70 L 78 95 L 86 95 Z" fill="#111827" />
    <rect x="14" y="98" width="8" height="50" rx="2" fill="#111827" />
    <rect x="78" y="98" width="8" height="50" rx="2" fill="#111827" />

    {/* Rear Window */}
    <path d="M 26 158 L 74 158 C 70 170, 30 170, 26 158 Z" fill="#111827" />

    {/* Rear Spoiler */}
    <path d="M 20 155 L 80 155 C 75 160, 25 160, 20 155 Z" fill={color} style={{ filter: 'brightness(0.9)' }} />

    {/* Tail lights */}
    <path d="M 12 160 C 16 160, 24 165, 24 170 L 14 175 Z" fill="#EF4444" />
    <path d="M 88 160 C 84 160, 76 165, 76 170 L 86 175 Z" fill="#EF4444" />
    
    {/* Side Mirrors */}
    <path d="M 18 72 C 10 70, 8 75, 12 78 L 18 76 Z" fill={color} />
    <path d="M 82 72 C 90 70, 92 75, 88 78 L 82 76 Z" fill={color} />
  </svg>
);

export default Swift;

import React from 'react';

const Scorpio = ({ color = '#3B82F6' }) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 5px 8px rgba(0,0,0,0.45))' }}>
    {/* Tires */}
    <rect x="4" y="30" width="12" height="25" rx="3" fill="#111827" />
    <rect x="84" y="30" width="12" height="25" rx="3" fill="#111827" />
    <rect x="4" y="145" width="12" height="25" rx="3" fill="#111827" />
    <rect x="84" y="145" width="12" height="25" rx="3" fill="#111827" />

    {/* Body */}
    <path d="M 14 20 C 14 10, 86 10, 86 20 L 88 180 C 88 190, 12 190, 12 180 Z" fill={color} />

    {/* Front Grill & Bumper */}
    <rect x="14" y="12" width="72" height="12" rx="3" fill="#111827" />
    <path d="M 30 14 L 70 14 L 68 22 L 32 22 Z" fill="#374151" />
    {/* Vertical chrome grill lines */}
    {[0,1,2,3,4].map(i => (
      <rect key={i} x={36 + i * 6} y="15" width="2" height="6" fill="#9CA3AF" />
    ))}

    {/* Headlights (Aggressive) */}
    <path d="M 14 12 C 24 10, 30 12, 30 18 L 18 22 Z" fill="#E5E7EB" />
    <circle cx="22" cy="16" r="3" fill="#FEF08A" />
    <path d="M 86 12 C 76 10, 70 12, 70 18 L 82 22 Z" fill="#E5E7EB" />
    <circle cx="78" cy="16" r="3" fill="#FEF08A" />

    {/* Hood */}
    <path d="M 22 25 L 78 25 L 74 65 L 26 65 Z" fill="#000000" opacity="0.1" />
    
    {/* Hood Scoop - iconic for Scorpio */}
    <rect x="42" y="35" width="16" height="10" rx="2" fill={color} style={{ filter: 'brightness(0.8)' }} />
    <rect x="44" y="35" width="12" height="2" fill="#111827" />

    {/* Windshield */}
    <path d="M 16 70 C 40 65, 60 65, 84 70 L 80 90 L 20 90 Z" fill="#111827" />
    <path d="M 22 73 C 45 68, 55 68, 78 73 L 74 85 L 26 85 Z" fill="#60A5FA" opacity="0.35" />

    {/* Roof */}
    <rect x="20" y="90" width="60" height="75" rx="4" fill={color} style={{ filter: 'brightness(1.1)' }} />
    {/* Roof Rails */}
    <rect x="18" y="95" width="4" height="65" rx="2" fill="#374151" />
    <rect x="78" y="95" width="4" height="65" rx="2" fill="#374151" />
    <rect x="25" y="95" width="50" height="4" fill="#374151" />
    <rect x="25" y="156" width="50" height="4" fill="#374151" />

    {/* Sunroof */}
    <rect x="35" y="100" width="30" height="20" rx="3" fill="#111827" />

    {/* Side Windows */}
    <path d="M 14 92 C 14 92, 18 90, 18 90 L 18 165 L 14 165 Z" fill="#111827" />
    <path d="M 86 92 C 86 92, 82 90, 82 90 L 82 165 L 86 165 Z" fill="#111827" />
    
    {/* Rear Window */}
    <rect x="24" y="165" width="52" height="10" rx="2" fill="#111827" />

    {/* Tail lights (Vertical pillar lights) */}
    <rect x="14" y="165" width="6" height="15" rx="2" fill="#EF4444" />
    <rect x="80" y="165" width="6" height="15" rx="2" fill="#EF4444" />

    {/* Rear Bumper with step */}
    <rect x="18" y="182" width="64" height="6" rx="2" fill="#1F2937" />
    <rect x="35" y="185" width="30" height="4" rx="1" fill="#4B5563" />

    {/* Side Mirrors */}
    <path d="M 14 74 L 8 74 C 6 74, 6 78, 8 78 L 16 78 Z" fill={color} />
    <path d="M 86 74 L 92 74 C 94 74, 94 78, 92 78 L 84 78 Z" fill={color} />
  </svg>
);

export default Scorpio;

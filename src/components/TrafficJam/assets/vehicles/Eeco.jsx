import React from 'react';

const Eeco = ({ color = '#FACC15' }) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.4))' }}>
    {/* Tires */}
    <rect x="6" y="25" width="8" height="22" rx="2" fill="#111827" />
    <rect x="86" y="25" width="8" height="22" rx="2" fill="#111827" />
    <rect x="6" y="150" width="8" height="22" rx="2" fill="#111827" />
    <rect x="86" y="150" width="8" height="22" rx="2" fill="#111827" />

    {/* Body */}
    <rect x="10" y="10" width="80" height="180" rx="12" fill={color} />

    {/* Front Bumper & Snout */}
    <rect x="14" y="8" width="72" height="15" rx="4" fill="#374151" />
    <rect x="25" y="12" width="50" height="6" rx="2" fill="#111827" />

    {/* Headlights */}
    <rect x="16" y="10" width="14" height="10" rx="3" fill="#F3F4F6" />
    <circle cx="23" cy="15" r="3" fill="#FEF08A" />
    <rect x="70" y="10" width="14" height="10" rx="3" fill="#F3F4F6" />
    <circle cx="77" cy="15" r="3" fill="#FEF08A" />

    {/* Short Hood */}
    <path d="M 20 23 L 80 23 L 75 35 L 25 35 Z" fill="#000000" opacity="0.05" />

    {/* Windshield - large & flat */}
    <path d="M 14 38 L 86 38 L 82 60 L 18 60 Z" fill="#111827" />
    <path d="M 20 42 L 80 42 L 77 56 L 23 56 Z" fill="#93C5FD" opacity="0.3" /> {/* glass reflection */}

    {/* Roof - long with ribbed texture */}
    <rect x="16" y="65" width="68" height="110" rx="4" fill="#ffffff" opacity="0.1" />
    {/* Ribs */}
    {[0,1,2,3,4,5,6].map(i => (
      <rect key={i} x="20" y={75 + i*14} width="60" height="2" fill="#000000" opacity="0.1" />
    ))}

    {/* Side Windows - large van windows */}
    <rect x="12" y="65" width="4" height="40" rx="1" fill="#111827" />
    <rect x="84" y="65" width="4" height="40" rx="1" fill="#111827" />
    
    <rect x="12" y="110" width="4" height="55" rx="1" fill="#111827" />
    <rect x="84" y="110" width="4" height="55" rx="1" fill="#111827" />

    {/* Rear Window */}
    <rect x="16" y="170" width="68" height="10" rx="2" fill="#111827" />

    {/* Rear Bumper */}
    <rect x="14" y="185" width="72" height="8" rx="3" fill="#374151" />
    
    {/* Tail lights */}
    <rect x="16" y="182" width="8" height="10" rx="2" fill="#EF4444" />
    <rect x="76" y="182" width="8" height="10" rx="2" fill="#EF4444" />

    {/* Side Mirrors - small basic mirrors */}
    <rect x="6" y="45" width="8" height="6" rx="2" fill="#111827" />
    <rect x="86" y="45" width="8" height="6" rx="2" fill="#111827" />
  </svg>
);

export default Eeco;

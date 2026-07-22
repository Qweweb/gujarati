import React from 'react';

const Thar = ({ color = '#EF4444' }) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 6px 8px rgba(0,0,0,0.5))' }}>
    {/* Tires protruding */}
    <rect x="2" y="35" width="12" height="30" rx="3" fill="#111827" />
    <rect x="86" y="35" width="12" height="30" rx="3" fill="#111827" />
    <rect x="2" y="140" width="12" height="30" rx="3" fill="#111827" />
    <rect x="86" y="140" width="12" height="30" rx="3" fill="#111827" />

    {/* Main Body */}
    <rect x="12" y="15" width="76" height="175" rx="8" fill={color} />

    {/* Front Bumper & Grill */}
    <rect x="10" y="10" width="80" height="15" rx="4" fill="#1F2937" />
    <rect x="25" y="15" width="50" height="8" rx="2" fill="#111827" />
    {/* Grill slots (Thar iconic 7 slots) */}
    {[0,1,2,3,4,5,6].map(i => (
      <rect key={i} x={30 + i * 6} y="16" width="2" height="6" fill="#374151" />
    ))}

    {/* Headlights */}
    <circle cx="20" cy="18" r="5" fill="#FEF08A" stroke="#9CA3AF" strokeWidth="1" />
    <circle cx="80" cy="18" r="5" fill="#FEF08A" stroke="#9CA3AF" strokeWidth="1" />

    {/* Hood */}
    <path d="M 18 25 L 82 25 L 78 60 L 22 60 Z" fill="#000000" opacity="0.1" /> {/* Hood gradient/shadow */}
    {/* Hood latches */}
    <rect x="15" y="35" width="4" height="8" rx="1" fill="#374151" />
    <rect x="81" y="35" width="4" height="8" rx="1" fill="#374151" />

    {/* Windshield */}
    <path d="M 16 65 L 84 65 L 80 85 L 20 85 Z" fill="#111827" />
    <path d="M 22 68 L 78 68 L 76 82 L 24 82 Z" fill="#60A5FA" opacity="0.4" /> {/* glass reflection */}

    {/* Hardtop Roof */}
    <rect x="14" y="90" width="72" height="85" rx="4" fill="#1F2937" />
    {/* Roof ribs */}
    <rect x="25" y="95" width="4" height="75" fill="#374151" />
    <rect x="48" y="95" width="4" height="75" fill="#374151" />
    <rect x="71" y="95" width="4" height="75" fill="#374151" />

    {/* Side Windows */}
    <rect x="10" y="95" width="6" height="30" rx="1" fill="#111827" />
    <rect x="84" y="95" width="6" height="30" rx="1" fill="#111827" />
    <rect x="10" y="130" width="6" height="35" rx="1" fill="#111827" />
    <rect x="84" y="130" width="6" height="35" rx="1" fill="#111827" />

    {/* Rear Window */}
    <rect x="25" y="165" width="50" height="8" rx="2" fill="#111827" />

    {/* Spare Tire on Back */}
    <circle cx="50" cy="185" r="14" fill="#111827" />
    <circle cx="50" cy="185" r="8" fill="#4B5563" />
    <circle cx="50" cy="185" r="3" fill="#9CA3AF" />

    {/* Rear Bumper */}
    <rect x="10" y="185" width="80" height="10" rx="3" fill="#1F2937" />
    <rect x="15" y="188" width="12" height="4" rx="1" fill="#EF4444" />
    <rect x="73" y="188" width="12" height="4" rx="1" fill="#EF4444" />

    {/* Side Mirrors */}
    <rect x="4" y="68" width="10" height="6" rx="2" fill="#111827" />
    <rect x="86" y="68" width="10" height="6" rx="2" fill="#111827" />
  </svg>
);

export default Thar;

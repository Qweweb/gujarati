import React from 'react';

const GsrtcBus = ({ color = '#DC2626' }) => (
  <svg viewBox="0 0 100 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.5))' }}>
    {/* Tires (Dual wheels on rear) */}
    <rect x="4" y="50" width="12" height="35" rx="2" fill="#111827" />
    <rect x="84" y="50" width="12" height="35" rx="2" fill="#111827" />
    <rect x="2" y="300" width="16" height="40" rx="3" fill="#111827" /> {/* Rear dual wheels are wider */}
    <rect x="82" y="300" width="16" height="40" rx="3" fill="#111827" />

    {/* Bus Body */}
    <rect x="14" y="10" width="72" height="380" rx="6" fill={color} />

    {/* White Stripe (Iconic ST Bus Stripe) */}
    <rect x="14" y="10" width="4" height="380" fill="#FFFFFF" opacity="0.8" />
    <rect x="82" y="10" width="4" height="380" fill="#FFFFFF" opacity="0.8" />
    <rect x="18" y="10" width="2" height="380" fill="#FBBF24" opacity="0.8" />
    <rect x="80" y="10" width="2" height="380" fill="#FBBF24" opacity="0.8" />

    {/* Front Bumper */}
    <rect x="14" y="8" width="72" height="8" rx="2" fill="#1F2937" />
    <rect x="20" y="8" width="10" height="6" fill="#F3F4F6" /> {/* Left Headlight block */}
    <circle cx="25" cy="11" r="2" fill="#FEF08A" />
    <rect x="70" y="8" width="10" height="6" fill="#F3F4F6" /> {/* Right Headlight block */}
    <circle cx="75" cy="11" r="2" fill="#FEF08A" />

    {/* Front Flat Windshield */}
    <rect x="16" y="20" width="68" height="25" rx="2" fill="#111827" />
    <rect x="20" y="22" width="60" height="20" rx="1" fill="#60A5FA" opacity="0.3" /> {/* glass reflection */}
    
    {/* Driver Steering wheel outline seen through glass */}
    <circle cx="35" cy="35" r="4" stroke="#4B5563" strokeWidth="2" fill="none" />

    {/* Roof Surface */}
    <rect x="18" y="50" width="64" height="330" fill="#F3F4F6" opacity="0.9" />
    
    {/* Roof Hatches / Vents */}
    <rect x="40" y="70" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2" />
    <rect x="40" y="250" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="2" />

    {/* Large AC Units (if it's a Volvo/Gurjarnagri, usually they have one large box) */}
    <rect x="30" y="120" width="40" height="50" rx="4" fill="#D1D5DB" />
    <rect x="35" y="125" width="30" height="40" fill="#9CA3AF" />
    {/* Fans in AC */}
    <circle cx="50" cy="135" r="8" fill="#4B5563" />
    <circle cx="50" cy="155" r="8" fill="#4B5563" />

    {/* Roof luggage rack / railing lines */}
    <line x1="22" y1="60" x2="22" y2="370" stroke="#9CA3AF" strokeWidth="1" />
    <line x1="78" y1="60" x2="78" y2="370" stroke="#9CA3AF" strokeWidth="1" />

    {/* GSRTC Text on Roof */}
    <text x="50" y="220" fontFamily="sans-serif" fontSize="16" fontWeight="900" fill="#DC2626" textAnchor="middle" transform="rotate(-90 50 220)" letterSpacing="4">GSRTC</text>

    {/* Side Windows (Continuous bus windows) */}
    <rect x="14" y="50" width="4" height="320" fill="#111827" />
    <rect x="82" y="50" width="4" height="320" fill="#111827" />
    {/* Window dividers */}
    {[0,1,2,3,4,5,6,7].map(i => (
      <rect key={i} x="14" y={80 + i*35} width="4" height="2" fill={color} />
    ))}
    {[0,1,2,3,4,5,6,7].map(i => (
      <rect key={i} x="82" y={80 + i*35} width="4" height="2" fill={color} />
    ))}

    {/* Rear Window */}
    <rect x="18" y="380" width="64" height="8" rx="1" fill="#111827" />

    {/* Rear Bumper & Tail lights */}
    <rect x="14" y="390" width="72" height="8" rx="2" fill="#1F2937" />
    <rect x="18" y="392" width="12" height="4" rx="1" fill="#EF4444" />
    <rect x="70" y="392" width="12" height="4" rx="1" fill="#EF4444" />
    <rect x="32" y="392" width="8" height="4" rx="1" fill="#FBBF24" />
    <rect x="60" y="392" width="8" height="4" rx="1" fill="#FBBF24" />

    {/* Large Side Mirrors (Bus style extended mirrors) */}
    <path d="M 14 25 L -2 22 L -2 30 L 14 28 Z" fill="#111827" />
    <rect x="-4" y="20" width="4" height="15" rx="1" fill="#374151" />
    
    <path d="M 86 25 L 102 22 L 102 30 L 86 28 Z" fill="#111827" />
    <rect x="100" y="20" width="4" height="15" rx="1" fill="#374151" />
  </svg>
);

export default GsrtcBus;

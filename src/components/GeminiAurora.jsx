import React from 'react';
import '../aurora.css';

/**
 * GeminiAurora
 * A modern Mesh Gradient / Aurora Gradient background component.
 * Uses 4 overlapping animated blobs with extreme blur to create a fluid, organic, liquid feel.
 * 
 * Usage:
 * Place this component inside a relative container to act as its background.
 */
export default function GeminiAurora({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
      {/* Brand Teal Blob */}
      <div className="aurora-blob aurora-blob-1"></div>
      
      {/* Deep Purple Blob */}
      <div className="aurora-blob aurora-blob-2"></div>
      
      {/* Soft Pink Blob */}
      <div className="aurora-blob aurora-blob-3"></div>
      
      {/* Neon Blue Blob */}
      <div className="aurora-blob aurora-blob-4"></div>
      
      {/* Optional overlay to give a glassmorphism effect on top of the gradient */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[20px] z-10"></div>
    </div>
  );
}

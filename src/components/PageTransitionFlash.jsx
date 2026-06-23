import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../flash.css'; // Or './flash.css' depending on path. Let's put this component in src/components/PageTransitionFlash.jsx

const PageTransitionFlash = () => {
  const location = useLocation();
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    // Increment key to re-trigger animation on route change
    setFlashKey(prev => prev + 1);
  }, [location.pathname]);

  if (flashKey === 0) return null; // Don't flash on initial very first render

  return (
    <div 
      key={flashKey} 
      className="flash-circle"
    />
  );
};

export default PageTransitionFlash;

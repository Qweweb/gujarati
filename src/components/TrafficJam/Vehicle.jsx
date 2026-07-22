import React from 'react';
import { motion } from 'framer-motion';

// Helper to determine the image source and CSS filters based on vehicle type and color
const getImageProps = (type, color) => {
  let src = '/car.png'; // Default to the blue car model
  let filter = 'none';

  // Determine base image
  if (type === 'auto_rickshaw') {
    src = '/rickshaw.png';
  } else if (type === 'gsrtc_bus') {
    src = color === 'white' ? '/white_bus.png' : '/st_bus.png';
  } else {
    // For swift, thar, scorpio, fortuner, eeco
    if (color === 'green') src = '/green_car.png';
    else src = '/car.png'; // Base blue car
  }

  // Apply color filters if it's the base car and needs recoloring
  if (src === '/car.png') {
    if (color === 'red') {
      // Blue to Red
      filter = 'hue-rotate(120deg) saturate(1.5)';
    } else if (color === 'yellow') {
      // Blue to Yellow
      filter = 'hue-rotate(180deg) saturate(1.5) brightness(1.2)';
    } else if (color === 'white') {
      filter = 'grayscale(100%) brightness(200%)';
    } else if (color === 'black') {
      filter = 'grayscale(100%) brightness(30%)';
    }
  }

  return { src, filter };
};

const Vehicle = ({ vehicle, cellSize, onDragEnd, isHero, dragConstraints }) => {
  const { id, type, color, length, orientation, row, col } = vehicle;

  const { src, filter } = getImageProps(type, color);

  const isHorizontal = orientation === 'horizontal';
  const width = isHorizontal ? length * cellSize : cellSize;
  const height = isHorizontal ? cellSize : length * cellSize;

  return (
    <motion.div
      drag={isHorizontal ? 'x' : 'y'}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      onDragEnd={(event, info) => onDragEnd(id, info)}
      initial={{ x: col * cellSize, y: row * cellSize }}
      animate={{ x: col * cellSize, y: row * cellSize }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'absolute',
        width,
        height,
        padding: 0,
        zIndex: 10,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div 
        className="relative" 
        style={{ 
          width: cellSize,
          height: length * cellSize,
          transform: isHorizontal ? 'rotate(-90deg)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px'
        }}
      >
        <img 
          src={src} 
          alt={`${color} ${type}`} 
          className="w-full h-full object-contain drop-shadow-md"
          style={{ filter, pointerEvents: 'none', transform: 'scale(1.15)' }}
        />
        
        {/* Highlight for hero vehicle */}
        {isHero && (
          <div className="absolute inset-1 border-4 border-yellow-400 rounded-lg animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.8)] pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
};

export default Vehicle;

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { DIRECTIONS } from './GameEngine';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default function Shape({ shape, onTryMove, disabled, cellSize, boardSize }) {
  const controls = useAnimation();
  const [isError, setIsError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const segments = shape.segments;
  
  const head = segments[segments.length - 1];
  const hx = head.x * cellSize + cellSize / 2;
  const hy = head.y * cellSize + cellSize / 2;

  // Pre-calculate escape translation for exit animation
  const escapeDistPx = boardSize * cellSize + cellSize;
  let ex = hx, ey = hy;
  switch (shape.direction) {
    case DIRECTIONS.UP: ey = hy - escapeDistPx; break;
    case DIRECTIONS.DOWN: ey = hy + escapeDistPx; break;
    case DIRECTIONS.LEFT: ex = hx - escapeDistPx; break;
    case DIRECTIONS.RIGHT: ex = hx + escapeDistPx; break;
  }

  useEffect(() => {
    if (isError) {
      const bumpDistance = cellSize * 0.08; // Slighter visual bump
      let bx = 0, by = 0;
      switch (shape.direction) {
        case DIRECTIONS.UP: by = -bumpDistance; break;
        case DIRECTIONS.DOWN: by = bumpDistance; break;
        case DIRECTIONS.LEFT: bx = -bumpDistance; break;
        case DIRECTIONS.RIGHT: bx = bumpDistance; break;
      }
      controls.start({
        x: [0, bx, 0],
        y: [0, by, 0],
        transition: { duration: 0.2 }
      });
      setTimeout(() => setIsError(false), 1000);
    }
  }, [isError, controls, cellSize, shape.direction]);

  const handleTap = async () => {
    if (disabled || isExiting) return;
    
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}

    const canMove = onTryMove(shape);

    if (!canMove) {
      try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
      setIsError(true);
    } else {
      setIsExiting(true);
    }
    // If it CAN move, the parent will unmount it, triggering the exit animation on the children!
  };

  // Build the continuous path
  let pathStr = "";
  for (let i = 0; i < segments.length; i++) {
    const px = segments[i].x * cellSize + cellSize / 2;
    const py = segments[i].y * cellSize + cellSize / 2;
    pathStr += `${i === 0 ? 'M' : 'L'} ${px} ${py} `;
  }
  
  // Extend path off the board for the escape
  pathStr += `L ${ex} ${ey}`;

  // Exactly calculate the fraction of the path that is the visible body
  let snakeLengthPx = (segments.length - 1) * cellSize;
  const totalLengthPx = snakeLengthPx + escapeDistPx;
  const frac = snakeLengthPx / totalLengthPx;

  // Thin line (approx 30% of previous thickness)
  const strokeWidth = cellSize * 0.04; 
  
  // Arrowhead size (increased by 30% as requested)
  const capExtend = strokeWidth / 2;
  const W = cellSize * 0.13; 
  const L = cellSize * 0.13; 

  let p1x, p1y, p2x, p2y, p3x, p3y;
  switch (shape.direction) {
    case DIRECTIONS.UP:
      p1x = hx - W/2; p1y = hy - capExtend;
      p2x = hx;       p2y = hy - capExtend - L;
      p3x = hx + W/2; p3y = hy - capExtend;
      break;
    case DIRECTIONS.DOWN:
      p1x = hx - W/2; p1y = hy + capExtend;
      p2x = hx;       p2y = hy + capExtend + L;
      p3x = hx + W/2; p3y = hy + capExtend;
      break;
    case DIRECTIONS.LEFT:
      p1x = hx - capExtend; p1y = hy - W/2;
      p2x = hx - capExtend - L; p2y = hy;
      p3x = hx - capExtend; p3y = hy + W/2;
      break;
    case DIRECTIONS.RIGHT:
      p1x = hx + capExtend; p1y = hy - W/2;
      p2x = hx + capExtend + L; p2y = hy;
      p3x = hx + capExtend; p3y = hy + W/2;
      break;
  }
  const arrowPoints = `${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`;

  const strokeColor = isError ? "#ef4444" : shape.isBrahmastra ? "#FBBF24" : shape.isBomb ? "#3B82F6" : "#6d4c41"; 
  const duration = 0.5;

  const midIndex = Math.floor(segments.length / 2);
  const mx = segments[midIndex].x * cellSize + cellSize / 2;
  const my = segments[midIndex].y * cellSize + cellSize / 2;

  const filterStyle = shape.isBrahmastra ? "drop-shadow(0px 0px 6px #FBBF24)" : "none";

  return (
    <motion.g 
      onClick={handleTap} 
      style={{ cursor: disabled ? 'default' : 'pointer', filter: filterStyle }}
      animate={controls}
    >
      
      {/* Invisible thick hit area */}
      <motion.path
        d={pathStr}
        stroke="transparent"
        strokeWidth={cellSize * 0.8}
        fill="none"
        initial={{ pathLength: frac, pathOffset: 0 }}
        animate={{ pathLength: frac, pathOffset: 0 }}
        exit={{ pathOffset: 1, opacity: [1, 1, 0], transition: { duration, ease: 'easeIn' } }}
      />

      {/* Visible slithering snake line with round corners */}
      <motion.path
        d={pathStr}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: frac, pathOffset: 0 }}
        animate={{ pathLength: frac, pathOffset: 0 }}
        exit={{ pathOffset: 1, opacity: [1, 1, 0], transition: { duration, ease: 'easeIn' } }}
      />

      {/* The Arrowhead */}
      <motion.polygon
        points={arrowPoints}
        fill={strokeColor}
        initial={{ x: 0, y: 0 }}
        exit={{ x: ex - hx, y: ey - hy, opacity: [1, 1, 0], transition: { duration, ease: 'easeIn' } }}
      />

      {/* Time Bomb Text */}
      {shape.isBomb && (
         <motion.text
            x={mx}
            y={my}
            fill="#FFF"
            fontSize={cellSize * 0.4}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
         >
            {shape.bombTime}
         </motion.text>
      )}
    </motion.g>
  );
}

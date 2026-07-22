import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Shape from './Shape';

export default function GameBoard({ shapes, onTryMove, disabled, width = 320, boardSize }) {
  const cellSize = width / boardSize;

  return (
    <div className="w-full flex justify-center items-center select-none" style={{ touchAction: 'none' }}>
      <svg 
        width={width} 
        height={width} 
        viewBox={`0 0 ${width} ${width}`}
        className="bg-transparent"
        style={{ overflow: 'visible' }}
      >
        {/* Draw faint dots for the grid corners to outline paths */}
        {Array.from({ length: (boardSize + 1) * (boardSize + 1) }).map((_, idx) => {
          const x = (idx % (boardSize + 1)) * cellSize;
          const y = Math.floor(idx / (boardSize + 1)) * cellSize;
          return (
            <circle 
              key={`dot-${idx}`}
              cx={x} cy={y} r={1.5} fill="#d5ccba"
            />
          );
        })}

        <AnimatePresence>
          {shapes.map(shape => (
            <Shape 
              key={shape.id} 
              shape={shape} 
              onTryMove={onTryMove} 
              disabled={disabled}
              cellSize={cellSize}
              boardSize={boardSize}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}

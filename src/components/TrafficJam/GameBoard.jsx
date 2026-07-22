import React, { useState, useEffect, useRef } from 'react';
import Vehicle from './Vehicle';
import { getAllowedRange } from './utils/gridHelpers';

const GameBoard = ({ level, onWin, onMove }) => {
  const [vehicles, setVehicles] = useState([]);
  const [boardSize, setBoardSize] = useState(300);
  const containerRef = useRef(null);

  useEffect(() => {
    if (level) {
      setVehicles([level.heroVehicle, ...level.vehicles]);
    }
  }, [level]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setBoardSize(Math.min(width, 400)); // Max 400px wide
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!level) return null;

  const { rows, cols } = level.gridSize;
  const cellSize = boardSize / cols;

  const handleDragEnd = (id, info) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    const { offset } = info;
    const isHorizontal = vehicle.orientation === 'horizontal';
    
    // Calculate how many cells we dragged (rounding to nearest cell)
    const dragCells = Math.round((isHorizontal ? offset.x : offset.y) / cellSize);
    
    if (dragCells === 0) {
      // Force a re-render to snap back to current position
      setVehicles([...vehicles]); 
      return;
    }

    const { min, max } = getAllowedRange(vehicle, vehicles, level.gridSize);
    
    let newPos = (isHorizontal ? vehicle.col : vehicle.row) + dragCells;
    
    // Clamp to allowed range
    newPos = Math.max(min, Math.min(newPos, max));

    let moved = false;
    const newVehicles = vehicles.map(v => {
      if (v.id === id) {
        const currentPos = isHorizontal ? v.col : v.row;
        if (currentPos !== newPos) moved = true;
        
        return {
          ...v,
          col: isHorizontal ? newPos : v.col,
          row: isHorizontal ? v.row : newPos
        };
      }
      return v;
    });

    setVehicles(newVehicles);

    if (moved) {
      onMove();
      
      // Check win condition
      const hero = newVehicles.find(v => v.id === level.heroVehicle.id);
      if (level.exit.side === 'right' && hero.col >= cols) {
        // Hero has completely exited the board
        setTimeout(() => {
          onWin();
        }, 300);
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center my-4">
      <div 
        ref={containerRef}
        className="relative bg-stone-200 dark:bg-stone-800 rounded-xl shadow-inner border-4 border-stone-300 dark:border-stone-700"
        style={{ width: boardSize, height: (boardSize / cols) * rows }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div key={i} className="border border-stone-300/30 dark:border-stone-700/30" />
          ))}
        </div>

        {/* Exit Marker */}
        {level.exit.side === 'right' && (
          <div 
            className="absolute bg-green-500/20 border-r-4 border-green-500 flex items-center justify-center animate-pulse"
            style={{
              top: level.exit.row * cellSize,
              right: 0,
              width: cellSize,
              height: cellSize,
              zIndex: 1
            }}
          >
            <span className="material-symbols-outlined text-green-600">exit_to_app</span>
          </div>
        )}

        {/* Vehicles */}
        {vehicles.map(v => {
          const { min, max } = getAllowedRange(v, vehicles, level.gridSize);
          const constraints = v.orientation === 'horizontal' 
            ? { left: min * cellSize, right: max * cellSize, top: v.row * cellSize, bottom: v.row * cellSize }
            : { top: min * cellSize, bottom: max * cellSize, left: v.col * cellSize, right: v.col * cellSize };

          return (
            <Vehicle 
              key={v.id} 
              vehicle={v} 
              cellSize={cellSize} 
              onDragEnd={handleDragEnd}
              isHero={v.id === level.heroVehicle.id}
              dragConstraints={constraints}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameBoard;

export const DIRECTIONS = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
};

function getDelta(direction) {
  switch (direction) {
    case DIRECTIONS.UP: return { dx: 0, dy: -1 };
    case DIRECTIONS.DOWN: return { dx: 0, dy: 1 };
    case DIRECTIONS.LEFT: return { dx: -1, dy: 0 };
    case DIRECTIONS.RIGHT: return { dx: 1, dy: 0 };
    default: return { dx: 0, dy: 0 };
  }
}

function isOutOfBounds(x, y, size) {
  return x < 0 || x >= size || y < 0 || y >= size;
}

function getMask(levelIndex, size) {
  const mask = Array(size).fill(null).map(() => Array(size).fill(true));
  
  // Make patterns appear exactly on every 5th level (Level 5, 10, 15...)
  if ((levelIndex + 1) % 5 === 0) {
    const type = ((levelIndex + 1) / 5) % 9;
    const center = Math.floor(size / 2);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = Math.abs(x - center);
        const dyCenter = y - center;
        const dist = Math.hypot(dx, dyCenter);

        if (type === 1) { 
          // Hollow Square (donut)
          if (dx <= 2 && Math.abs(dyCenter) <= 2) mask[y][x] = false;
        } else if (type === 2) { 
          // Cross
          if (dx > Math.floor(size/3.5) && Math.abs(dyCenter) > Math.floor(size/3.5)) mask[y][x] = false;
        } else if (type === 3) { 
          // Diamond
          if (dx + Math.abs(dyCenter) > size / 1.8) mask[y][x] = false;
        } else if (type === 4) { 
          // Ribbon
          const distToTopCenter = Math.hypot(x - center, y - center + 2);
          if (distToTopCenter > size/2 - 1 && y < size - 4) mask[y][x] = false; 
          if (distToTopCenter <= 2) mask[y][x] = false; 
          if (y >= size - 4 && dx < 2) mask[y][x] = false; 
        } else if (type === 5) { 
          // Heart (Geometric curve)
          const nx = (x - center) / (size / 2.5);
          const ny = -(y - center) / (size / 2.5); 
          if (nx*nx + Math.pow(ny - Math.sqrt(Math.abs(nx)), 2) > 1.2) mask[y][x] = false;
        } else if (type === 6) { 
          // Cat Face (Animal Shape)
          const isHead = dist < size/2.4;
          const isEar = y < center && dx > size/6 && dx < size/1.8 && (y - center + dx * 1.5) < 0;
          if (!isHead && !isEar) mask[y][x] = false;
        } else if (type === 7) { 
          // Flower / Star (Geometric)
          const angle = Math.atan2(dyCenter, x - center);
          const maxR = (size/2.5) * (0.8 + 0.4 * Math.cos(5 * angle));
          if (dist > maxR) mask[y][x] = false;
        } else if (type === 8) { 
          // Triangle / Pyramid
          if (dx > (y + size*0.1) * 0.55 || y > size - 2) mask[y][x] = false;
        }
      }
    }
  }
  return mask;
}

// Slithering Snake Dense Generation (Reverse Time)
export function generateLevel(levelIndex) {
  // Scale size much faster up to a larger max grid (20)
  const size = Math.min(8 + Math.floor(levelIndex / 2), 20);
  const mask = getMask(levelIndex, size);
  const grid = Array(size).fill(null).map(() => Array(size).fill(false));
  const shapes = [];

  const maxTries = size * size * 25;
  let shapeIdCounter = 1;

  for (let i = 0; i < maxTries; i++) {
    // 1. Generate a random local path (contiguous line)
    // Paths get MUCH longer and more zig-zag at high levels
    const maxLen = Math.min(5 + Math.floor(levelIndex * 0.8), 40);
    const targetLength = Math.floor(Math.random() * (maxLen - 2)) + 2;
    const localPath = [{x: 0, y: 0}];
    let cx = 0, cy = 0;
    const localVisited = new Set(['0,0']);
    for(let j=1; j<targetLength; j++) {
      const dirs = [ {dx: 0, dy: -1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0} ].sort(() => Math.random() - 0.5);
      let moved = false;
      for (const d of dirs) {
        const nx = cx + d.dx;
        const ny = cy + d.dy;
        if (!localVisited.has(`${nx},${ny}`)) {
          localPath.push({x: nx, y: ny});
          localVisited.add(`${nx},${ny}`);
          cx = nx;
          cy = ny;
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }

    // 2. Pick a random escape direction
    const escapeDir = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT][Math.floor(Math.random() * 4)];
    const { dx: edx, dy: edy } = getDelta(escapeDir);

    // 3. Try placing this shape anywhere on the board
    let placed = false;
    for(let attempts=0; attempts<15; attempts++) {
      const tx = Math.floor(Math.random() * size);
      const ty = Math.floor(Math.random() * size);
      
      const shiftedPath = localPath.map(p => ({x: p.x + tx, y: p.y + ty}));
      
      // Check if it fits on board and doesn't overlap existing shapes
      // ALSO check if it fits inside the MASK!
      let fits = true;
      for (const p of shiftedPath) {
        if (isOutOfBounds(p.x, p.y, size) || !mask[p.y][p.x] || grid[p.y][p.x]) {
          fits = false; break;
        }
      }
      if (!fits) continue;

      // Check if the arrowhead (last segment) is perfectly parallel to escapeDir
      const neck = shiftedPath[shiftedPath.length - 2];
      const head = shiftedPath[shiftedPath.length - 1];
      if (head.x - neck.x !== edx || head.y - neck.y !== edy) {
         continue; // Not aligned, reject this placement
      }

      // Check if it can SLITHER escape through CURRENTLY PLACED shapes (reverse time)
      // Since it slithers, ONLY the straight path from the head in escapeDir must be clear!
      let hitObstacles = false;
      let checkX = head.x + edx;
      let checkY = head.y + edy;
      while(!isOutOfBounds(checkX, checkY, size)) {
        if (grid[checkY][checkX]) {
          hitObstacles = true;
          break;
        }
        checkX += edx;
        checkY += edy;
      }

      let isBrahmastra = false;
      let isBomb = false;
      let bombTime = 0;
      
      const rand = Math.random();
      
      if (hitObstacles) {
         // It hit an obstacle. We can ONLY place it if we turn it into a Brahmastra.
         if (levelIndex >= 2 && rand < 0.05 && !shapes.some(s => s.isBrahmastra)) {
            isBrahmastra = true;
         } else {
            continue; // Cannot escape, reject placement
         }
      } else {
         // Free path. Can be a bomb, but NOT a Brahmastra.
         if (levelIndex >= 3 && rand > 0.85) {
            isBomb = true;
            bombTime = 15 + Math.floor(Math.random() * 10);
         }
      }

      // Place it on the grid!
      for (const p of shiftedPath) {
        grid[p.y][p.x] = true;
      }

      shapes.push({
        id: `s${shapeIdCounter++}`,
        direction: escapeDir,
        segments: shiftedPath,
        isBrahmastra,
        isBomb,
        bombTime
      });
      placed = true;
      break;
    }
  }

  const moves = shapes.length + 5;

  return {
    size,
    moves,
    shapes: shapes.reverse() // Render shapes from bottom to top for proper escape layering
  };
}

// Slithering Snake Collision Check (Ensures ONLY the head path is clear)
export function canShapeMove(targetShape, allShapes, boardSize) {
  if (targetShape.isBrahmastra) return true; // Brahmastra bypasses all obstacles!

  const head = targetShape.segments[targetShape.segments.length - 1];
  const { dx, dy } = getDelta(targetShape.direction);
  
  let tx = head.x + dx;
  let ty = head.y + dy;

  while (!isOutOfBounds(tx, ty, boardSize)) {
    // Check if any other active shape occupies (tx, ty)
    for (const shape of allShapes) {
      if (shape.id === targetShape.id) continue;
      for (const seg of shape.segments) {
        if (seg.x === tx && seg.y === ty) {
          return false;
        }
      }
    }
    tx += dx;
    ty += dy;
  }

  return true;
}

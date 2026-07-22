const fs = require('fs');
const path = require('path');

// Basic vehicle types
const VEHICLE_TYPES = [
  { type: 'swift', length: 2 },
  { type: 'eeco', length: 2 },
  { type: 'thar', length: 2 },
  { type: 'scorpio', length: 2 },
  { type: 'fortuner', length: 3 },
  { type: 'auto_rickshaw', length: 1 },
  { type: 'gsrtc_bus', length: 3 },
];

const COLORS = ['yellow', 'white', 'red', 'blue'];

const GRID_ROWS = 6;
const GRID_COLS = 6;

// Deep copy state
const cloneState = (state) => JSON.parse(JSON.stringify(state));

// Check if a cell is free in a given state
const isCellFree = (state, row, col) => {
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) return false;
  return !state.some(v => {
    if (v.orientation === 'horizontal') {
      return v.row === row && col >= v.col && col < v.col + v.length;
    } else {
      return v.col === col && row >= v.row && row < v.row + v.length;
    }
  });
};

// Check if hero has a clear path to exit
const checkWin = (state, heroId, exit) => {
  const hero = state.find(v => v.id === heroId);
  if (!hero) return false;
  
  if (exit.side === 'right') {
    if (hero.orientation !== 'horizontal' || hero.row !== exit.row) return false;
    // Check if path is clear to the right
    for (let c = hero.col + hero.length; c < GRID_COLS; c++) {
      if (!isCellFree(state, hero.row, c)) return false;
    }
    return true;
  }
  return false;
};

// Get all possible next states
const getNextStates = (state) => {
  const nextStates = [];
  
  for (let i = 0; i < state.length; i++) {
    const v = state[i];
    
    if (v.orientation === 'horizontal') {
      // Try move left
      if (isCellFree(state, v.row, v.col - 1)) {
        const newState = cloneState(state);
        newState[i].col -= 1;
        nextStates.push(newState);
      }
      // Try move right
      if (isCellFree(state, v.row, v.col + v.length)) {
        const newState = cloneState(state);
        newState[i].col += 1;
        nextStates.push(newState);
      }
    } else {
      // Try move up
      if (isCellFree(state, v.row - 1, v.col)) {
        const newState = cloneState(state);
        newState[i].row -= 1;
        nextStates.push(newState);
      }
      // Try move down
      if (isCellFree(state, v.row + v.length, v.col)) {
        const newState = cloneState(state);
        newState[i].row += 1;
        nextStates.push(newState);
      }
    }
  }
  
  return nextStates;
};

// Hash state for visited set
const hashState = (state) => {
  return state.map(v => `${v.id}:${v.row},${v.col}`).sort().join('|');
};

// BFS to find shortest path to win
const solve = (initialState, heroId, exit) => {
  const queue = [{ state: initialState, depth: 0 }];
  const visited = new Set();
  visited.add(hashState(initialState));
  
  while (queue.length > 0) {
    const { state, depth } = queue.shift();
    
    if (checkWin(state, heroId, exit)) {
      return depth; // +1 if we count the exit move itself
    }
    
    if (depth > 20) continue; // limit depth for generation speed
    
    const nextStates = getNextStates(state);
    for (const ns of nextStates) {
      const h = hashState(ns);
      if (!visited.has(h)) {
        visited.add(h);
        queue.push({ state: ns, depth: depth + 1 });
      }
    }
  }
  
  return -1; // Unsolvable or requires > 20 moves
};

// Generate a random valid level
const generateLevel = (id) => {
  let bestLevel = null;
  let bestMoves = -1;
  
  // Try up to 100 times to generate a good level
  for (let attempt = 0; attempt < 100; attempt++) {
    const state = [];
    const exit = { side: 'right', row: 2 };
    
    // Add hero
    const hero = {
      id: 'hero',
      type: 'swift',
      color: 'red',
      row: 2,
      col: Math.floor(Math.random() * 2), // 0 or 1
      length: 2,
      orientation: 'horizontal'
    };
    state.push(hero);
    
    // Add 5-10 random blockers
    const numBlockers = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < numBlockers; i++) {
      const typeObj = VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
      if (typeObj.type === 'swift') continue; // don't use swift for blockers to avoid confusion
      
      const v = {
        id: `v${i+1}`,
        type: typeObj.type,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        length: typeObj.length,
        orientation: Math.random() < 0.5 ? 'horizontal' : 'vertical'
      };
      
      // Try to place it
      let placed = false;
      for (let tries = 0; tries < 20; tries++) {
        v.row = Math.floor(Math.random() * GRID_ROWS);
        v.col = Math.floor(Math.random() * GRID_COLS);
        
        // ensure it fits in grid
        if (v.orientation === 'horizontal' && v.col + v.length > GRID_COLS) continue;
        if (v.orientation === 'vertical' && v.row + v.length > GRID_ROWS) continue;
        
        // check overlap
        let overlap = false;
        for (let r = 0; r < (v.orientation === 'vertical' ? v.length : 1); r++) {
          for (let c = 0; c < (v.orientation === 'horizontal' ? v.length : 1); c++) {
            if (!isCellFree(state, v.row + r, v.col + c)) {
              overlap = true;
              break;
            }
          }
          if (overlap) break;
        }
        
        // Don't place horizontal block in row 2 that blocks hero exit easily (unless it can move)
        // Actually, just let it place, the solver will check it.
        
        if (!overlap) {
          state.push(v);
          placed = true;
          break;
        }
      }
    }
    
    // Check solvability
    // First check if it's already solved
    if (checkWin(state, 'hero', exit)) continue;
    
    const moves = solve(state, 'hero', exit);
    if (moves > 3 && moves > bestMoves) { // We want at least 3 moves
      bestMoves = moves;
      let difficulty = 'easy';
      if (moves > 8) difficulty = 'medium';
      if (moves > 14) difficulty = 'hard';
      
      bestLevel = {
        id: id,
        gridSize: { rows: GRID_ROWS, cols: GRID_COLS },
        exit: exit,
        heroVehicle: state.find(v => v.id === 'hero'),
        vehicles: state.filter(v => v.id !== 'hero'),
        difficulty: difficulty,
        minMoves: moves
      };
    }
  }
  
  return bestLevel;
};

console.log("Generating 20 levels...");
const levels = [];
for (let i = 1; i <= 20; i++) {
  let level = generateLevel(i);
  while (!level) {
    level = generateLevel(i); // keep trying until we get one
  }
  levels.push(level);
  console.log(`Generated level ${i} (moves: ${level.minMoves})`);
}

const outDir = path.join(__dirname, 'src', 'components', 'TrafficJam', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'levels_pack1.json'), JSON.stringify(levels, null, 2));
console.log("Done generating levels.");

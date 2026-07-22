// Check if a cell is free in the current layout
export const isCellFree = (vehicles, row, col, ignoreVehicleId = null) => {
  return !vehicles.some(v => {
    if (v.id === ignoreVehicleId) return false;
    if (v.orientation === 'horizontal') {
      return v.row === row && col >= v.col && col < v.col + v.length;
    } else {
      return v.col === col && row >= v.row && row < v.row + v.length;
    }
  });
};

export const getAllowedRange = (vehicle, allVehicles, gridSize) => {
  let min = 0;
  let max = 0;

  if (vehicle.orientation === 'horizontal') {
    // Check left
    min = vehicle.col;
    while (min > 0 && isCellFree(allVehicles, vehicle.row, min - 1, vehicle.id)) {
      min--;
    }
    // Check right
    max = vehicle.col;
    while (true) {
      const nextCol = max + vehicle.length;
      if (nextCol >= gridSize.cols) {
        if (vehicle.id === 'hero' && max < gridSize.cols) {
          max++;
          continue;
        }
        break;
      }
      if (!isCellFree(allVehicles, vehicle.row, nextCol, vehicle.id)) break;
      max++;
    }
    return { min, max };
  } else {
    // Check up
    min = vehicle.row;
    while (min > 0 && isCellFree(allVehicles, min - 1, vehicle.col, vehicle.id)) {
      min--;
    }
    // Check down
    max = vehicle.row;
    while (max + vehicle.length < gridSize.rows && isCellFree(allVehicles, max + vehicle.length, vehicle.col, vehicle.id)) {
      max++;
    }
    return { min, max };
  }
};

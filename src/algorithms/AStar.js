import { GRID_COL_LENGTH, GRID_ROW_LENGTH } from "../variables/variable";

export default function AStar(grid, startNode, endNode) {
  let openSet = [];
  let closedSet = [];

  assignNeighborsToGrid(grid);
  startNode = grid[startNode.row][startNode.col];
  endNode = grid[endNode.row][endNode.col];

  openSet.push(startNode);

  while (openSet.length > 0) {
    let closestNodeIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[closestNodeIndex].f) closestNodeIndex = i;
    }
    let current = openSet[closestNodeIndex];

    if (current.row === endNode.row && current.col === endNode.col) {
      return closedSet;
    }

    removeElementFromArr(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (
        !isRowAndColIncludeInArray(closedSet, neighbor.row, neighbor.col) &&
        !neighbor.isWall
      ) {
        let tempG = current.g + heuristic(current, neighbor);

        let newPath = false;
        if (isRowAndColIncludeInArray(openSet, neighbor.row, neighbor.col)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, endNode);
          console.log(neighbor.h);
          neighbor.f = neighbor.h + neighbor.g;
          neighbor.previousNode = current;
        }
      }
    }
  }
  return closedSet;
}

const assignNeighborsToGrid = (grid) => {
  for (let i = 0; i < GRID_ROW_LENGTH; i++) {
    for (let j = 0; j < GRID_COL_LENGTH; j++) {
      grid[i][j].neighbors = addNeighbors(grid, i, j);
    }
  }
};

const addNeighbors = (grid, row, col) => {
  let neighbors = [];
  if (grid.length === 0) return [];
  if (row < GRID_ROW_LENGTH - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (col < GRID_COL_LENGTH - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  return neighbors;
};

function removeElementFromArr(arr, element) {
  const index = arr.indexOf(element);
  arr.splice(index, 1);
}

function heuristic(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function isRowAndColIncludeInArray(arr, row, col) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].row === row && arr[i].col === col) return true;
  }
  return false;
}

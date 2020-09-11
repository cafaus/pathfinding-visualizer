export function dijkstra(grid, startNode, finishNode) {
  const visitedNodeInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getConvertedOneDimensionArr(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodeInOrder;
    closestNode.isVisited = true;
    visitedNodeInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodeInOrder;
    updateUnvisitedNeighbors(grid, closestNode);
  }
}

function getConvertedOneDimensionArr(grid) {
  const newGrid = [];
  for (const row of grid) {
    for (const node of row) {
      newGrid.push(node);
    }
  }
  return newGrid;
}

function sortNodesByDistance(arr) {
  arr.sort((a, b) => a.distance - b.distance);
}

function updateUnvisitedNeighbors(grid, node) {
  const unvisitedNeighbors = getUnvisitedNeighbors(grid, node);
  for (const unvisitedNeighbor of unvisitedNeighbors) {
    unvisitedNeighbor.distance = node.distance + 1;
    unvisitedNeighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(grid, node) {
  const unvisitedNeighbors = [];
  const { row, col } = node;

  if (col > 0) unvisitedNeighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) unvisitedNeighbors.push(grid[row][col + 1]);
  if (row > 0) unvisitedNeighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) unvisitedNeighbors.push(grid[row + 1][col]);
  return unvisitedNeighbors.filter((unvisitedNeighbor) => {
    return !unvisitedNeighbor.isVisited;
  });
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPath = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPath.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPath;
}

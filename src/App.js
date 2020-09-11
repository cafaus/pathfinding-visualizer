import React, { useState, useEffect } from "react";
import PathFindingVisualizer from "./components/PathFindingVisualizer";
import NavBar from "./components/NavBar";
import { GRID_COL_LENGTH, GRID_ROW_LENGTH, ASTAR } from "./variables/variable";
import "./style/index.css";
import Information from "./components/Information";

function App() {
  const [isSetStartPoint, setIsSetStartPoint] = useState(false);
  const [isSetFinishPoint, setIsSetFinishPoint] = useState(false);
  const [isVisualizerFinished, setisVisualizerFinished] = useState(true);
  const [simulationSpeedValue, setSimulationSpeedValue] = useState(1);
  const [grid, setGrid] = useState([]);
  const [animationTimeOutArr, setAnimationTimeOutArr] = useState([]);
  const [pathfindingAlgorithm, setPathfindingAlgorithm] = useState(ASTAR);
  const [isInformationOpen, setIsInformationOpen] = useState(false);

  const getReferenceToAllNode = () => {
    const gridRef = [];
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      const currRow = [];
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        currRow.push(React.createRef());
      }
      gridRef.push(currRow);
    }
    return gridRef;
  };
  const [gridRef, setGridRef] = useState(getReferenceToAllNode());

  useEffect(() => {
    const newGrid = getInitializeGrid();

    setGrid(newGrid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitializeGrid = () => {
    const grid = [];
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      const currRow = [];
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        currRow.push(createNode(i, j));
      }
      grid.push(currRow);
    }

    return grid;
  };

  const createNode = (row, col) => {
    return {
      col,
      row,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      f: 0,
      h: 0,
      g: 0,
      neighbors: [],
    };
  };

  const resetGridExceptStartPointFinishPointAndWall = () => {
    let newGrid = grid.slice();
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        let node = newGrid[i][j];
        if (node.isWall || node.isStart || node.isFinish) {
          newGrid[i][j].isVisited = false;
          newGrid[i][j].previousNode = null;
          newGrid[i][j].distance = Infinity;
          newGrid[i][j].neighbors = [];
          continue;
        }
        newGrid[i][j] = createNode(i, j);
      }
    }
    setGrid(newGrid);
  };

  const resetGridExceptStartPointAndFinishPoint = () => {
    let newGrid = grid.slice();
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        let node = newGrid[i][j];
        if (node.isStart || node.isFinish) {
          newGrid[i][j].isVisited = false;
          newGrid[i][j].previousNode = null;
          newGrid[i][j].distance = Infinity;
          newGrid[i][j].isWall = false;
          newGrid[i][j].neighbors = [];
          continue;
        }
        newGrid[i][j] = createNode(i, j);
      }
    }
    setGrid(newGrid);
  };

  const resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall = () => {
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        const node = grid[i][j];
        if (node.isWall || node.isStart || node.isFinish) continue;
        gridRef[i][j].current.className = "node-btn ";
      }
    }
  };

  const resetAllNodeClassNameIntoDefaultExceptStartPointFinishPoint = () => {
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        const node = grid[i][j];
        if (node.isStart || node.isFinish) continue;
        gridRef[i][j].current.className = "node-btn ";
      }
    }
  };

  const resetAllNodeClassNameIntoDefault = () => {
    for (let i = 0; i < GRID_ROW_LENGTH; i++) {
      for (let j = 0; j < GRID_COL_LENGTH; j++) {
        gridRef[i][j].current.className = "node-btn ";
      }
    }
  };

  const setIsSetStartToTrue = () => {
    setIsSetStartPoint(true);
    setIsSetFinishPoint(false);
  };

  const setIsSetStartToFalse = () => {
    setIsSetStartPoint(false);
  };

  const setIsSetFinishToTrue = () => {
    setIsSetFinishPoint(true);
    setIsSetStartPoint(false);
  };

  const setIsSetFinishToFalse = () => {
    setIsSetFinishPoint(false);
  };

  const animateDjikstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    let promise, timeOut;
    let arrTimeOut = [];
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        promise = new Promise((resolve) => {
          timeOut = setTimeout(async () => {
            const message = await animateShortestPath(nodesInShortestPathOrder);
            resolve(message);
          }, (100 - simulationSpeedValue) * i);
          arrTimeOut.push(timeOut);
          setAnimationTimeOutArr(arrTimeOut);
        });

        return promise;
      }
      if (visitedNodesInOrder[i].isStart || visitedNodesInOrder[i].isFinish)
        continue;
      timeOut = setTimeout(() => {
        const node = visitedNodesInOrder[i];
        gridRef[node.row][node.col].current.className = "node-btn visited-node";
      }, (100 - simulationSpeedValue) * i);
      arrTimeOut.push(timeOut);
    }
  };

  const animateShortestPath = (nodesInShortesPathOrder) => {
    let promise, timeOut;
    let arrTimeOut = [...animationTimeOutArr];

    for (let i = 1; i < nodesInShortesPathOrder.length - 1; i++) {
      promise = new Promise((resolve) => {
        timeOut = setTimeout(() => {
          const node = nodesInShortesPathOrder[i];
          gridRef[node.row][node.col].current.className =
            "node-btn shortest-path";
          resolve("visualizer is done");
        }, 50 * i);
        arrTimeOut.push(timeOut);
      });
    }

    setAnimationTimeOutArr(arrTimeOut);
    return promise;
  };

  const cancelAnimation = () => {
    let animations = animationTimeOutArr.slice();
    animations.map((animation) => {
      clearTimeout(animation);
    });
    resetAnimationTimeOutArr();
  };

  const resetAnimationTimeOutArr = () => setAnimationTimeOutArr([]);

  const toggleIsInformationIsOpen = () => {
    if (isInformationOpen) {
      setIsInformationOpen(false);
    } else {
      setIsInformationOpen(true);
    }
  };

  return (
    <>
      <NavBar
        simulationSpeedValue={simulationSpeedValue}
        setSimulationSpeedValue={(value) => setSimulationSpeedValue(value)}
        setIsSetStartToTrue={setIsSetStartToTrue}
        setIsSetFinishToTrue={setIsSetFinishToTrue}
        setisVisualizerFinished={(value) => setisVisualizerFinished(value)}
        pathfindingAlgorithm={pathfindingAlgorithm}
        setPathfindingAlgorithm={(value) => setPathfindingAlgorithm(value)}
        resetGridExceptStartPointFinishPointAndWall={
          resetGridExceptStartPointFinishPointAndWall
        }
        resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall={
          resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall
        }
        cancelAnimation={cancelAnimation}
      />
      <PathFindingVisualizer
        GRID_COL_LENGTH={GRID_COL_LENGTH}
        GRID_ROW_LENGTH={GRID_ROW_LENGTH}
        grid={grid}
        gridRef={gridRef}
        setGrid={(value) => setGrid(value)}
        getInitializeGrid={getInitializeGrid}
        simulationSpeedValue={simulationSpeedValue}
        isSetStartPoint={isSetStartPoint}
        isSetFinishPoint={isSetFinishPoint}
        isVisualizerFinished={isVisualizerFinished}
        pathfindingAlgorithm={pathfindingAlgorithm}
        setIsSetStartToFalse={setIsSetStartToFalse}
        setIsSetFinishToFalse={setIsSetFinishToFalse}
        setisVisualizerFinished={(value) => setisVisualizerFinished(value)}
        resetGridExceptStartPointFinishPointAndWall={
          resetGridExceptStartPointFinishPointAndWall
        }
        resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall={
          resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall
        }
        animateDjikstra={(visitedNodesInOrder, nodesInShortestPathOrder) =>
          animateDjikstra(visitedNodesInOrder, nodesInShortestPathOrder)
        }
        cancelAnimation={cancelAnimation}
        resetGridExceptStartPointAndFinishPoint={
          resetGridExceptStartPointAndFinishPoint
        }
        resetAllNodeClassNameIntoDefault={resetAllNodeClassNameIntoDefault}
        resetAllNodeClassNameIntoDefaultExceptStartPointFinishPoint={
          resetAllNodeClassNameIntoDefaultExceptStartPointFinishPoint
        }
        toggleIsInformationIsOpen={toggleIsInformationIsOpen}
        isInformationOpen={isInformationOpen}
      />
      <Information isInformationOpen={isInformationOpen}></Information>
    </>
  );
}

export default App;

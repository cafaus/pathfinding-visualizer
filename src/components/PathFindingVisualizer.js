import React, { Component } from "react";
import Node from "./Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import AStar from "../algorithms/AStar";
import { ASTAR } from "../variables/variable";

class PathFindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseIsPressed: false,

      startPointYCoordinate: null,
      startPointXCoordinate: null,
      finishPointYCoordinate: null,
      finishPointXCoordinate: null,
    };
    this.gridRef = this.props.gridRef;
  }

  handleMouseDown = (row, col) => {
    let newGrid;

    if (this.props.isSetStartPoint) {
      newGrid = this.getNewGridWithStartPoint(row, col);
      this.props.setGrid(newGrid);
      this.props.setIsSetStartToFalse();
      return;
    }

    if (this.props.isSetFinishPoint) {
      newGrid = this.getNewGridWithFinishPoint(row, col);
      this.props.setGrid(newGrid);
      this.props.setIsSetFinishToFalse();
      return;
    }

    if (this.props.grid[row][col].isStart || this.props.grid[row][col].isFinish)
      return;
    newGrid = this.getNewGridWithToggleWall(this.props.grid, row, col);
    this.props.setGrid(newGrid);
    this.setState({
      mouseIsPressed: true,
    });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed || this.props.isSetStartPoint) return;

    const newGrid = this.getNewGridWithToggleWall(this.props.grid, row, col);
    this.props.setGrid(newGrid);
  };

  handleMouseUp = () => {
    if (this.props.isSetStartPoint) return;
    this.setState({ mouseIsPressed: false });
  };

  getNewGridWithStartPoint = (row, col) => {
    const { startPointYCoordinate, startPointXCoordinate } = this.state;
    const { grid } = this.props;
    let newGrid = grid.slice();
    let node;

    if (startPointYCoordinate !== null && startPointXCoordinate !== null) {
      node = newGrid[startPointYCoordinate][startPointXCoordinate];
      newGrid[startPointYCoordinate][startPointXCoordinate] = {
        ...node,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    }

    node = newGrid[row][col];

    const newNode = {
      ...node,
      isStart: true,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
    };
    newGrid[row][col] = newNode;

    this.setState({
      startPointYCoordinate: row,
      startPointXCoordinate: col,
    });
    return newGrid;
  };

  getNewGridWithFinishPoint = (row, col) => {
    const { finishPointYCoordinate, finishPointXCoordinate } = this.state;
    const { grid } = this.props;
    let newGrid = grid.slice();
    let node;

    if (newGrid[row][col].isWall) {
      newGrid[row][col].isWall = false;
    }

    if (finishPointYCoordinate !== null && finishPointXCoordinate !== null) {
      node = newGrid[finishPointYCoordinate][finishPointXCoordinate];
      newGrid[finishPointYCoordinate][finishPointXCoordinate] = {
        ...node,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    }

    node = newGrid[row][col];

    const newNode = {
      ...node,
      isStart: false,
      isFinish: true,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
    newGrid[row][col] = newNode;

    this.setState({
      finishPointYCoordinate: row,
      finishPointXCoordinate: col,
    });
    return newGrid;
  };

  getNewGridWithToggleWall = (grid, row, col) => {
    const {
      cancelAnimation,
      resetGridExceptStartPointFinishPointAndWall,
      resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall,
    } = this.props;
    let newGrid = grid.slice();
    let node = newGrid[row][col];
    cancelAnimation();
    resetGridExceptStartPointFinishPointAndWall();
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall();

    const newNode = {
      ...node,
      distance: Infinity,
      isVisited: false,
      previousNode: null,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  visualizeDjikstra = async () => {
    const {
      startPointYCoordinate,
      startPointXCoordinate,
      finishPointXCoordinate,
      finishPointYCoordinate,
    } = this.state;

    const {
      setisVisualizerFinished,
      resetGridExceptStartPointFinishPointAndWall,
      resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall,
      setIsSetStartToFalse,
      setIsSetFinishToFalse,
      cancelAnimation,
      pathfindingAlgorithm,
      isVisualizerFinished,
    } = this.props;

    cancelAnimation();
    resetGridExceptStartPointFinishPointAndWall();
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall();
    setIsSetStartToFalse();
    setIsSetFinishToFalse();
    if (!isVisualizerFinished) {
      setisVisualizerFinished(true);
      return;
    }

    if (startPointXCoordinate === null || startPointYCoordinate === null) {
      alert("please set the start point");
      return;
    }

    if (finishPointXCoordinate === null || finishPointYCoordinate === null) {
      alert("please set the finish point");
      return;
    }
    setisVisualizerFinished(false);
    const { grid } = this.props;
    const startNode = grid[startPointYCoordinate][startPointXCoordinate];
    const finishNode = grid[finishPointYCoordinate][finishPointXCoordinate];

    const visitedNodesInOrder =
      pathfindingAlgorithm === ASTAR
        ? AStar(grid, startNode, finishNode)
        : dijkstra(grid, startNode, finishNode);

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log(nodesInShortestPathOrder);

    const x = await this.props.animateDjikstra(
      visitedNodesInOrder,
      nodesInShortestPathOrder
    );
    if (finishNode.previousNode === null) {
      alert("there is no path to the finish point");
      setisVisualizerFinished(true);
      return;
    }
    setisVisualizerFinished(true);
  };

  handleClearBoard = () => {
    const {
      getInitializeGrid,
      cancelAnimation,
      resetAllNodeClassNameIntoDefault,
    } = this.props;
    cancelAnimation();
    const grid = getInitializeGrid();
    resetAllNodeClassNameIntoDefault();
    this.props.setGrid(grid);
    this.setState({
      startPointXCoordinate: null,
      startPointYCoordinate: null,
      finishPointXCoordinate: null,
      finishPointYCoordinate: null,
    });
    return;
  };

  handleClearWall = () => {
    const {
      resetGridExceptStartPointAndFinishPoint,
      cancelAnimation,
      resetAllNodeClassNameIntoDefaultExceptStartPointFinishPoint,
    } = this.props;
    cancelAnimation();
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPoint();
    resetGridExceptStartPointAndFinishPoint();
    return;
  };

  render() {
    const {
      grid,
      isVisualizerFinished,
      toggleIsInformationIsOpen,
      isInformationOpen,
      isSetStartPoint,
      isSetFinishPoint,
    } = this.props;
    const setPointStatus = isSetStartPoint
      ? "is-set-start-node"
      : isSetFinishPoint
      ? "is-set-finish-node"
      : "";
    return (
      <>
        <div className="grids">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { col, row, isStart, isFinish, isWall } = node;
                  return (
                    <Node
                      ref={this.gridRef[rowIdx][nodeIdx]}
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      onMouseDown={() => this.handleMouseDown(row, col)}
                      onMouseEnter={() => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      setPointStatus={setPointStatus}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="footer">
          <div
            className="btn negative-neon-btn"
            onClick={() => this.handleClearBoard()}
          >
            Clear Board
          </div>
          <div
            className={
              isVisualizerFinished
                ? "btn positive-neon-btn"
                : "btn stop-positive-btn"
            }
            onClick={() => this.visualizeDjikstra()}
          >
            <div
              className={
                isVisualizerFinished
                  ? "play-stop-symbol"
                  : "play-stop-symbol stop"
              }
            ></div>
          </div>
          <div
            className="btn negative-neon-btn"
            onClick={() => this.handleClearWall()}
          >
            Clear Wall
          </div>
          <div
            className={
              isInformationOpen ? "information-btn open" : "information-btn"
            }
            onClick={() => toggleIsInformationIsOpen()}
          >
            <div className="information-btn-line"></div>
          </div>
        </div>
      </>
    );
  }
}

export default PathFindingVisualizer;

import React from "react";
import { ASTAR, DIJKSTRA } from "../variables/variable";

export default function NavBar(props) {
  const {
    setisVisualizerFinished,
    setSimulationSpeedValue,
    setIsSetFinishToTrue,
    setIsSetStartToTrue,
    simulationSpeedValue,
    setPathfindingAlgorithm,
    pathfindingAlgorithm,
    resetGridExceptStartPointFinishPointAndWall,
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall,
    cancelAnimation,
  } = props;

  const handleChangeSelect = (e) => {
    cancelAnimation();
    resetGridExceptStartPointFinishPointAndWall();
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall();
    setisVisualizerFinished(true);
    setPathfindingAlgorithm(e.target.value);
  };

  const handleInputRangeChange = (e) => {
    resetGridToInitExceptStartFinishPointAndWall();
    setSimulationSpeedValue(e.target.value);
  };

  const handleClickSetStartPoint = () => {
    resetGridToInitExceptStartFinishPointAndWall();
    setIsSetStartToTrue();
  };

  const handleClickSetFinishPoint = () => {
    resetGridToInitExceptStartFinishPointAndWall();
    setIsSetFinishToTrue();
  };

  const resetGridToInitExceptStartFinishPointAndWall = () => {
    cancelAnimation();
    resetGridExceptStartPointFinishPointAndWall();
    resetAllNodeClassNameIntoDefaultExceptStartPointFinishPointAndWall();
    setisVisualizerFinished(true);
  };

  return (
    <div className="navbar">
      <div className="title-wrapper">
        <h1 className="title">
          Pathfinding
          <br />
          Visualizer
        </h1>
      </div>
      <div className="settings">
        <div className="navbar-item algorithm">
          <h4 className="secondary-title">Pathfinding Algorithm</h4>
          <div className="pathfinding-algorithm-selector-wrapper">
            <select
              className="pathfinding-algorithm-selector"
              value={pathfindingAlgorithm}
              onChange={handleChangeSelect}
            >
              <option value={ASTAR}>A*</option>
              <option value={DIJKSTRA}>Djikstra</option>
            </select>
          </div>
        </div>
        <div className="navbar-item set-start-point">
          <h4 className="secondary-title">Set Start Point</h4>
          <button
            className="node-information start-node-btn"
            onClick={() => handleClickSetStartPoint()}
          ></button>
        </div>
        <div className="navbar-item set-finish-point">
          <h4 className="secondary-title">Set Finish Point</h4>
          <button
            className="node-information finish-node-btn"
            onClick={() => handleClickSetFinishPoint()}
          ></button>
        </div>
        <div className="navbar-item set-simulation-speed">
          <h4 className="secondary-title">Simulation Speed</h4>

          <div className="pathfinding-algorithm-selector-wrapper">
            <select
              className="pathfinding-algorithm-selector"
              value={simulationSpeedValue}
              onChange={handleInputRangeChange}
            >
              <option value={35}>Slow</option>
              <option value={60}>Medium</option>
              <option value={85}>Fast</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

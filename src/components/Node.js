import React from "react";

const Node = React.forwardRef((props, ref) => {
  const {
    row,
    col,
    isStart,
    isFinish,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    setPointStatus,
  } = props;
  const backgroundColor = isStart
    ? "start-node"
    : isFinish
    ? "finish-node"
    : isWall
    ? "wall-node"
    : "";
  return (
    <div
      ref={ref}
      className={`node-btn  ${backgroundColor} ${setPointStatus}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
});

export default Node;

import React from "react";

const Information = (props) => {
  const { isInformationOpen } = props;
  return (
    <>
      <div className={isInformationOpen ? "information open" : "information"}>
        <h1 className="title">Information</h1>
        <div className="information-items">
          <div className="information-item information-item-1">
            <h4 className="secondary-title">Start Node</h4>
            <div className="node-information start-node"></div>
          </div>
          <div className="information-item information-item-2">
            <h4 className="secondary-title">Finish Node</h4>
            <div className="node-information finish-node"></div>
          </div>
          <div className="information-item information-item-3">
            <h4 className="secondary-title">Wall Node</h4>
            <div className="node-information wall-node"></div>
          </div>
          <div className="information-item information-item-4">
            <h4 className="secondary-title">Visited Node</h4>
            <div className="node-information visited-node"></div>
          </div>
          <div className="information-item information-item-5">
            <h4 className="secondary-title">Shortest Path</h4>
            <div className="node-information shortest-path"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Information;

import React from "react";
import Tsuchinoko from "../images/tsuchinokoGif.gif";
import { useSelector } from "react-redux";

const Loading = () => {
  let loadStatus = useSelector((state) => state.loadStatus);

  return (
    <div className={`loading-container ${loadStatus.loading ? "show" : ""}`}>
      <div className="loading-spinner-background" />

      <div className="loading-spinner">
        <img src={Tsuchinoko} alt="Loading" />
      </div>
    </div>
  );
};

export default Loading;

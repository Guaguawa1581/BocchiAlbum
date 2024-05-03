import React, { useState, useEffect } from "react";
import Tsuchinoko from "../images/tsuchinokoGif.gif";
import { useSelector } from "react-redux";
import { selectIsLoading } from "../service/globalData";

const Loading = () => {
  const IsLoading = useSelector(selectIsLoading);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    setIsShow(IsLoading);
  }, [IsLoading]);

  return (
    <div className={`loading-container ${isShow ? "show" : ""}`}>
      <div className="loading-spinner-background" />

      <div className="loading-spinner">
        <img src={Tsuchinoko} alt="Loading" />
      </div>
    </div>
  );
};

export default Loading;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectUserInfo,
  selectIsCheckingLogin
} from "../service/globalData.js";

const PrivateRoute = () => {
  const UserInfo = useSelector(selectUserInfo);
  const IsCheckingLogin = useSelector(selectIsCheckingLogin);
  if (IsCheckingLogin) {
    return <h1 className="text-center fw-bolder my-5">LOADING . . . </h1>;
  }
  return UserInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

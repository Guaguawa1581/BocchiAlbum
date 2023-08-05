import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ userInfo }) => {
  if (userInfo.isDataLoading) {
    return <h1 className="text-center fw-bolder my-5">LOADING . . . </h1>;
  }
  return userInfo.isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

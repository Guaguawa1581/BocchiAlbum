import React from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { dataRefresh } from "../service/redux/actions";
// 預設大頭照

import AvatarPop from "./AvatarPop";

const HomeNavbar = ({ location, userInfo }) => {
  const dispatch = useDispatch();
  const reloadHome = () => {
    if (location.pathname === "/") {
      dispatch(dataRefresh(true));
    }
  };
  return (
    <>
      <header id="header">
        <nav>
          <div className="nav_logo">
            <Link onClick={reloadHome} to="/">
              BOCCHI ALBUM!
            </Link>
          </div>
          {/* 根据 isLoggedIn 的值进行条件渲染 */}
          {userInfo.isLoggedIn ? (
            location.pathname.startsWith("/album/") ? (
              <>
                <div className="nav_item">
                  <div className="me-2">
                    <AvatarPop imgSize={40} userData={userInfo.userData} />
                  </div>
                </div>
              </>
            ) : (
              <div className="nav_item">
                <div className="me-2">
                  <AvatarPop
                    imgSize={40}
                    imgSrc={userInfo.userData.avatar}
                    userData={userInfo.userData}
                    location={location}
                  />
                </div>
                <Link to={`/album/${userInfo.userData.user_id}`}>MyAlbum</Link>
              </div>
            )
          ) : (
            <div className="nav_item">
              <Link to="/login">LOGIN</Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default HomeNavbar;

import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsDataNeedRefresh, selectUserInfo } from "../service/globalData";
// 預設大頭照

import AvatarPop from "./AvatarPop";

const HomeNavbar = ({ location }) => {
  const dispatch = useDispatch();
  const UserInfo = useSelector(selectUserInfo);
  const reloadHome = () => {
    if (location.pathname === "/") {
      dispatch(setIsDataNeedRefresh(true));
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
          {UserInfo != null ? (
            location.pathname.startsWith("/album/") ? (
              <>
                <div className="nav_item">
                  <div className="me-2">
                    <AvatarPop imgSize={40} />
                  </div>
                </div>
              </>
            ) : (
              <div className="nav_item">
                <div className="me-2">
                  <AvatarPop
                    imgSize={40}
                    imgSrc={UserInfo.avatar}
                    location={location}
                  />
                </div>
                <Link to={`/album/${UserInfo.user_id}`}>MyAlbum</Link>
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

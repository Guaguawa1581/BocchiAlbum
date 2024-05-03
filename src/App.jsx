import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { message } from "antd";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import {
  setUserInfo,
  setIsCheckingLogin,
  selectUserInfo
} from "./service/globalData";
// views
import HomePage from "./views/HomePage";
import UserLogin from "./views/UserLogin";
import UserRegister from "./views/UserRegister";
import UserAlbum from "./views/UserAlbum";
import UserProfile from "./views/UserProfile";
import ForgetPw from "./views/ForgotPw";
import ResetPw from "./views/ResetPw";
// components
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Poster from "./components/Poster";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

message.config({
  top: 60,
  duration: 2,
  maxCount: 3
});

function App() {
  // 切換畫面會捲回頁首
  const location = useLocation();
  const dispatch = useDispatch();
  // 從redux中提取user資料
  const UserInfo = useSelector(selectUserInfo);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 使用cookie token取得用戶資料

  useEffect(() => {
    const checkToken = async () => {
      try {
        dispatch(setIsCheckingLogin(true));
        const bocchiToken = Cookies.get("bocchi");
        axios.defaults.headers.common["Authorization"] = bocchiToken;
        const checkRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/user/check`
        );
        console.log("cccccc", checkRes);
        dispatch(setIsCheckingLogin(false));
        dispatch(setUserInfo(checkRes.data.user));
      } catch (err) {
        dispatch(setIsCheckingLogin(false));
        dispatch(setUserInfo(null));
        console.log(err);
      }
    };
    checkToken();
  }, [dispatch]);

  //使否要顯示poster
  const isDisplayPoster =
    UserInfo &&
    (location.pathname === "/" || location.pathname.startsWith("/album/"));

  return (
    <div className="all_views">
      <Navbar location={location} />
      <Loading />
      {isDisplayPoster && <Poster />}
      <div className="all_routes">
        <SwitchTransition>
          <CSSTransition
            key={location.pathname}
            classNames="slide"
            timeout={1000}
            unmountOnExit
          >
            <Routes location={location}>
              <Route name="notFound" path="/*" element={<Navigate to="/" />} />
              <Route name="homepage" path="/" element={<HomePage />} />
              <Route name="loginpage" path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
              <Route path="/forgotPassword" element={<ForgetPw />} />
              <Route path="/resetPassword/:resetToken" element={<ResetPw />} />

              {/* 需要驗證的路由 */}
              <Route element={<PrivateRoute userInfo={UserInfo} />}>
                <Route path="/album/:id" element={<UserAlbum />} />
                <Route path="/editProfile" element={<UserProfile />} />
              </Route>
            </Routes>
          </CSSTransition>
        </SwitchTransition>
      </div>
      <Footer />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, Avatar, Modal } from "antd";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo, setUserInfo } from "../service/globalData";
import tsuchiAvatar from "../images/squareTsuchinokoGif.gif";

const AvatarPop = ({ imgSize, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserInfo = useSelector(selectUserInfo);
  const [userData, setUserData] = useState({
    avatar: "",
    username: "",
    email: "",
    user_id: ""
  });
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  useEffect(() => {
    if (UserInfo) {
      setUserData(UserInfo);
    }
  }, [UserInfo]);
  // LOGOUT
  const logoutModal = () => {
    setIsLogoutModal(true);
  };
  const handleLogout = () => {
    dispatch(setUserInfo(null));
    Cookies.remove("bocchi");
    setIsLogoutModal(false);
    Modal.destroyAll();
    navigate("/");
  };
  // 改變popover狀態
  const handlePopoverToggle = () => {
    setPopoverVisible(!popoverVisible);
  };

  const popoverContent = (
    <div className="avatar_pop_content">
      <div className="avatar">
        <div>
          <div>
            <img
              src={userData.avatar === "" ? tsuchiAvatar : userData.avatar}
              alt=""
            />
          </div>
        </div>
        {/* <ImageDrop
          type="avatar"
          label="AVATAR"
          imgSrc={imgSrc}
          getError={avatarErr}
          getFile={imgHandler}
        /> */}
      </div>
      <div className="user_info">
        <div>{userData.username}</div>

        <div>{userData.email}</div>
        <div>
          ID：<span className="fw-bold"> {userData.user_id}</span>
        </div>
      </div>
      <div className="btns">
        <Link
          className={props.location === "/editProfile" ? "disabled-link" : ""}
          to="/editProfile"
          onClick={handlePopoverToggle}
        >
          EDIT
          <span>
            <EditNoteIcon />
          </span>
        </Link>
        <Link
          className="logout_btn"
          to="#"
          onClick={() => {
            logoutModal();
          }}
        >
          LOGOUT
        </Link>
      </div>
    </div>
  );
  const popoverStyle = {
    position: "fixed",
    top: "60px",
    right: "10px",
    left: "auto",
    zIndex: 1000
  };

  return (
    <>
      <div className="avatar_card">
        <Popover
          content={popoverContent}
          trigger="click"
          arrow={false}
          overlayClassName="avatar_pop"
          overlayStyle={popoverStyle}
          open={popoverVisible}
          onOpenChange={handlePopoverToggle}
        >
          <Avatar
            src={userData.avatar === "" ? tsuchiAvatar : userData.avatar}
            alt="Avatar"
            size={imgSize}
            onClick={handlePopoverToggle}
          />
        </Popover>
      </div>
      <Modal
        className="logout_modal"
        width={300}
        centered
        open={isLogoutModal}
        onCancel={() => {
          setIsLogoutModal(false);
        }}
        footer={
          <div className="modal_btns">
            <button
              onClick={() => {
                setIsLogoutModal(false);
              }}
            >
              Never Mind
            </button>
            <button
              onClick={() => {
                handleLogout();
              }}
            >
              YES
            </button>
          </div>
        }
      >
        <div className="modal_text">Confirm to Logout ?</div>
      </Modal>
    </>
  );
};

export default AvatarPop;

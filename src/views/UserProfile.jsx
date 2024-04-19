import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import axios from "axios";
import { message } from "antd";
import Cookies from "js-cookie";
// icon
import { Collapse } from "react-bootstrap"; // 引入 react-bootstrap 中的 Collapse
import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";
import InputField from "../components/InputField";
import ImageDrop from "../components/ImageDrop";
import { userLogout, stateLoading } from "../service/redux/actions";
import uploadImg from "../service/uploadImg";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user);

  // 是否更改密碼
  const [isNewPassword, setIsNewPassword] = useState(false);
  const togglePassword = () => {
    setIsNewPassword((prevState) => !prevState);
  };
  // 驗證方式
  //   展開運算符 ...，這個運算符的作用是將對象中的屬性展開到另一個對象中。也就是說，...(is新的assword && {...}) 的意思是：
  // 如果 isNewPassword 是 true，則將 {...} 中的對象屬性展開到 Yup 驗證規則中。這裡的 {...} 包含了 new_password 和 confirm_new_password 的驗證規則。
  // 如果 isNewPassword 是 false，則不將 {...} 中的對象屬性展開，因此 Yup 驗證規則中只包含 username 的驗證規則。
  const validate = yup.object({
    username: yup
      .string()
      .max(20, "Username cannot exceed 20 characters")
      .required("USERNAME is required !"),
    ...(isNewPassword && {
      new_password: yup
        .string()
        .min(8, "PASSWORD must be at least 8 characters")
        .required("PASSWORD is required !"),
      confirm_new_password: yup
        .string()
        .oneOf([yup.ref("new_password")], "Confirm your PASSWORD")
    })
  });

  const [isDataChanged, setIsDataChanged] = useState(false); // 檢查資料是否一樣
  // 頭貼處理
  const [avatarImg, setAvatarImg] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarErr, setAvatarErr] = useState(false);

  useEffect(() => {
    setAvatarImg(userInfo.userData.avatar);
  }, [userInfo]);
  // 在外部使用 useCallback 優化回調函數
  const imgHandler = useCallback(
    (data) => {
      if (data !== null) {
        // 標記有更新profile、更改縮圖、state檔案
        setIsDataChanged(true);
        setAvatarImg(URL.createObjectURL(data));
        setNewAvatarFile(data);
        setAvatarErr(false);
      }
    },
    [setIsDataChanged]
  );

  const updateProfile = async (profile) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user`,
        profile
      );

      if (res.data.success) {
        return {
          success: true,
          message: "Update profile successfully"
        };
      } else {
        return {
          success: false,
          message: res.data.message
        };
      }
    } catch (err) {
      if (err.response.status === 404) {
        return {
          success: false,
          message: `Updated failed: ${err.message}`
        };
      } else {
        return {
          success: false,
          message: `Updated failed: ${err.response.data.message}`
        };
      }
    }
  };

  const submitHandler = async (data) => {
    dispatch(stateLoading(true));
    let formData = {};
    let avatarUrl;
    if (newAvatarFile) {
      const imgRes = await uploadImg(newAvatarFile);
      if (!imgRes.success) {
        dispatch(stateLoading(false));
        setAvatarErr(true);
        message.error(imgRes.message);
        return;
      } else {
        avatarUrl = imgRes.url;
      }
    } else {
      const oldAvatar = userInfo.userData.avatar;
      if (oldAvatar) {
        avatarUrl = oldAvatar;
      }
    }
    if (isNewPassword) {
      formData = {
        ...data,
        avatar: avatarUrl || "",
        isChangePassword: true
      };
    } else {
      formData = {
        username: data.username,
        avatar: avatarUrl || "",
        isChangePassword: false
      };
    }

    const updateRes = await updateProfile(formData);
    dispatch(stateLoading(false));
    if (updateRes.success && isNewPassword) {
      dispatch(userLogout());
      Cookies.remove("bocchi");
      message.success(updateRes.message, 5);
      navigate("/login");
    } else if (updateRes.success && !isNewPassword) {
      message.success(updateRes.message, 5);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      message.error(updateRes.message);
    }
  };

  const resetAll = () => {
    setAvatarImg(userInfo.userData.avatar);
    setNewAvatarFile(null);
    setIsDataChanged(false);
  };

  return (
    <div className="register_page">
      <div className="container box">
        <div className="title">PROFILE</div>
        <div className="form_box">
          <div className="avatar">
            <ImageDrop
              type="avatar"
              label="AVATAR"
              imgSrc={
                avatarImg
              }
              getFile={imgHandler}
              errorHint={avatarErr}
            />
          </div>
          {userInfo.userData && (
            <Formik
              initialValues={{
                username: userInfo.userData.username
              }}
              validationSchema={validate}
              onSubmit={submitHandler}
            >
              <Form className="w-100">
                <InputField
                  label="USERNAME"
                  type="text"
                  placeholder="Username..."
                  name="username"
                  onClick={() => {
                    setIsDataChanged(true);
                  }}
                />
                <div className="change_pwd_btn">
                  <div onClick={togglePassword}>
                    <div
                      className={`arrow ${isNewPassword ? "collapse_open" : ""
                        }`}
                    >
                      <span>
                        <ArrowForwardIosIcon fontSize="small" />
                      </span>
                    </div>
                    <span>Change PASSWORD ?</span>
                  </div>
                  <span className="text-white ms-4 text-decoration-none ">
                    {isNewPassword ? "YES" : "NO"}
                  </span>
                </div>
                <Collapse in={isNewPassword}>
                  <div>
                    <InputField
                      label="New PASSWORD"
                      type="password"
                      placeholder="New password..."
                      name="new_password"
                      onClick={() => {
                        setIsDataChanged(true);
                      }}
                    />
                    <InputField
                      label="Confirm New PASSWORD"
                      type="password"
                      placeholder="Confirm new password..."
                      name="confirm_new_password"
                      onClick={() => {
                        setIsDataChanged(true);
                      }}
                    />
                  </div>
                </Collapse>

                <div className="submit_btn justify-content-around ">
                  <button
                    type="reset"
                    onClick={() => {
                      resetAll();
                    }}
                  >
                    CANCEL
                  </button>
                  <button type="submit" disabled={!isDataChanged}>
                    SAVE
                  </button>
                </div>
              </Form>
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

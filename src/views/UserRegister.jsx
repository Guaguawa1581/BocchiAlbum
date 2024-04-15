import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { message } from "antd";
import axios from "axios";
import InputField from "../components/InputField";
import ImageDrop from "../components/ImageDrop";
import userLoginFn from "../service/userLoginFn";
import uploadImg from "../service/uploadImg";

// yup驗證套件
const validate = yup.object({
  username: yup
    .string()
    .max(20, "Username cannot exceed 20 characters")
    .required("USERNAME is required !"),
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid EMAIL"
    )
    .max(255, "Email cannot exceed 255 characters")
    .required("EMAIL is required !"),
  password: yup
    .string()
    .min(8, "PASSWORD must be at least 8 characters")
    .required("PASSWORD is required !"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Confirm your PASSWORD")
});

const UserRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Image handle
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarErr, setAvatarErr] = useState(false);
  const imgHandler = (data) => {
    setAvatarUrl(URL.createObjectURL(data));
    setAvatarFile(data);
  };

  const registerHandler = async (data) => {
    try {
      let avatarUrl;
      if (avatarFile) {
        const imgRes = await uploadImg(avatarFile);
        if (!imgRes.success) {
          setAvatarErr(true);
          throw new Error(imgRes.message);
        } else {
          setAvatarErr(false);
          avatarUrl = imgRes.url;
        }
      }

      const formData = {
        ...data,
        avatar: avatarUrl || ""
      };
      console.log("dddddata", formData);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user`,
        formData
      );
      if (res.data.success) {
        const loginData = {
          email: data.email,
          password: data.password
        };
        const loginRes = await userLoginFn(loginData, dispatch);
        if (loginRes.success) {
          message.success("Register new user and login successfully", 5);
          navigate("/");
        } else {
          message.open({
            type: "warning",
            content:
              "Register success. But login failed, please try again later.",
            duration: 5
          });
          navigate("/login");
        }
      } else {
        message.error(`Register failed: ${res.data.message}`);
      }
    } catch (err) {
      // 處理錯誤，可以在此處顯示錯誤訊息或進行其他處理
      if (err instanceof Error) {
        message.error(`Posted failed: ${err.message}`, 5);
        return;
      }
      message.error(`Register failed: ${err.response.data.message}`);
    }
  };

  return (
    <div className="register_page">
      <div className="container box">
        <div className="title">REGISTER</div>
        <div className="form_box">
          <div className="avatar">
            <ImageDrop
              type="avatar"
              label="AVATAR"
              imgSrc={avatarUrl}
              getFile={imgHandler}
              errorHint={avatarErr}
            />
          </div>
          <Formik
            className="w-100"
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={validate}
            onSubmit={registerHandler}
          >
            <Form className="w-100">
              <InputField
                label="USERNAME"
                type="text"
                placeholder="Username..."
                name="username"
                autoComplete="off"
              />
              <InputField
                label="EMAIL"
                type="text"
                placeholder="Email..."
                name="email"
                autoComplete="off"
              />
              <InputField
                label="PASSWORD"
                type="password"
                placeholder="Password..."
                name="password"
                autoComplete="off"
              />
              <InputField
                label="CONFIRM PASSWORD"
                type="password"
                placeholder="Confirm password..."
                name="confirm_password"
                autoComplete="off"
              />
              <div className="submit_btn flex-column">
                <button type="submit">SIGN UP</button>
                <Link to="/login">Already have an account?</Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

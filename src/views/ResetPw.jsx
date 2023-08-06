import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { message } from "antd";
import InputField from "../components/InputField";

// yup驗證套件
const validate = yup.object({
  new_password: yup
    .string()
    .min(8, "PASSWORD must be at least 8 characters")
    .required("PASSWORD is required !"),
  confirm_new_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Confirm your PASSWORD")
});

const ResetPw = () => {
  const navigate = useNavigate();

  // 檢查token
  const { resetToken } = useParams();
  const [tempUser, setTempUser] = useState(null);

  useEffect(() => {
    const checkToken = async (token) => {
      setTempUser(null);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/resetPassword/${resetToken}`
        );
        if (res.data.success) {
          setTempUser(res.data.user);
        } else {
          setTempUser(null);
          message.error("Token invalid.");
        }
      } catch (err) {
        message.error(`Error: ${err.response.data.message}`);
      }
    };
    checkToken(resetToken);
  }, [resetToken]);

  const submitHandle = async (value) => {
    try {
      const resetData = {
        ...value,
        reset_token: resetToken
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/user/resetPassword`,
        resetData
      );

      if (res.data.success) {
        message.success(res.data.message, 5);
        navigate("/login");
        return;
      }
    } catch (err) {
      message.error(`Error: ${err.response.data.message}`);
      return;
    }
  };

  return (
    <div className="password_page">
      <div className="container box">
        <div className="title">Reset Password</div>
        {!tempUser ? (
          <>
            <div className="expired_msg">
              <div className="bg-danger text-white">
                Token has expired or doesn't exist.
              </div>
              <Link to="/">Go to HomePage.</Link>
            </div>
          </>
        ) : (
          <div className="form_box">
            <div className="info_box">
              <h3>EMAIL</h3>
              <p>{tempUser.email}</p>
            </div>
            <Formik
              className="w-100"
              initialValues={{
                new_password: "",
                confirm_new_password: ""
              }}
              validationSchema={validate}
              onSubmit={submitHandle}
            >
              <Form className="w-100">
                <InputField
                  label="New PASSWORD"
                  type="password"
                  placeholder="New password..."
                  name="new_password"
                />
                <InputField
                  label="Confirm New PASSWORD"
                  type="password"
                  placeholder="Confirm new password..."
                  name="confirm_new_password"
                />
                <div className="submit_btn">
                  <button type="submit">CONTINUE</button>
                  <div>
                    <Link to="/">Go to HomePage.</Link>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPw;

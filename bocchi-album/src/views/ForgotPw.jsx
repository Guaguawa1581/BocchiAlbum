import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { message } from "antd";

import InputField from "../components/InputField";
import { stateLoading } from "../service/redux/actions";

// yup驗證套件
const validate = yup.object({
  email: yup
    .string()
    .email("Please enter valid EMAIL")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid EMAIL"
    )
    .max(255, "Email cannot exceed 255 characters")
    .required("EMAIL is required !")
});

const ForgetPw = () => {
  const dispatch = useDispatch();

  const [successMsg, setSuccessMsg] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const submitHandler = async (values) => {
    try {
      dispatch(stateLoading(true));
      const data = { email: values.email };
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/forgotPassword`,
        data
      );

      dispatch(stateLoading(false));
      if (res.data.success) {
        setErrMsg(null);
        setSuccessMsg(true);
        message.success("Email sent successfully");
      } else {
        setSuccessMsg(null);
        setErrMsg(true);
        message.error(res.data.message);
      }
    } catch (err) {
      dispatch(stateLoading(false));
      console.error("Error:", err);
      message.error(`Error: ${err.response.data.message}`);
    }
  };

  return (
    <div className="password_page">
      <div className="container box">
        <div className="title">Forgot Password?</div>
        {successMsg ? (
          <>
            <div className="success_msg">
              <div>
                We sent you an email which contains a link to reset your
                password.
              </div>
              <Link to="/">Go to HomePage.</Link>
            </div>
          </>
        ) : (
          <>
            <div className="hint">
              Enter your email address and we’ll send you a link to reset your
              password.
            </div>
            <div className="form_box">
              <Formik
                className="w-100"
                initialValues={{
                  email: ""
                }}
                validationSchema={validate}
                onSubmit={submitHandler}
              >
                <Form className="w-100">
                  {errMsg && (
                    <div className="text-center text-white bg-danger">
                      No account found with this email.
                    </div>
                  )}

                  <InputField
                    label="EMAIL"
                    type="text"
                    placeholder="Email..."
                    name="email"
                  />

                  <div className="submit_btn">
                    <button type="submit">Send Reset Link</button>
                    <div>
                      <Link to="/login">Go back to login page.</Link>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPw;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { message } from "antd";
import InputField from "../components/InputField";
import userLoginFn from "../service/userLoginFn";

// yup驗證套件
const validate = yup.object({
  email: yup
    .string()
    .email("Please enter valid EMAIL")
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid EMAIL"
    )
    .max(255, "Email cannot exceed 255 characters")
    .required("EMAIL is required !"),
  password: yup
    .string()
    .min(8, "PASSWORD must be at least 8 characters")
    .required("PASSWORD is required !")
});

const UserLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (values) => {
    const res = await userLoginFn(values, dispatch);
    if (res.success) {
      message.success(res.message);
      navigate("/");
    } else {
      message.open({
        type: "error",
        content: res.message
      });
    }
  };

  return (
    <div id="login_page">
      <div className="container box">
        <div className="title">LOGIN</div>
        <div className="form_box">
          <Formik
            className="w-100"
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={validate}
            onSubmit={loginHandler}
          >
            <Form className="w-100">
              <InputField
                label="EMAIL"
                type="text"
                placeholder="Email..."
                name="email"
              />
              <InputField
                label="PASSWORD"
                type="password"
                placeholder="Password..."
                name="password"
              />
              <div className="submit_btn">
                <button type="submit">CONTINUE</button>
                <div>
                  <Link to="/forgotPassword">Forgot Password ?</Link>
                  <Link to="/register">Don't have an account ?</Link>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;

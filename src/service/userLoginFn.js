import axios from "axios";
import Cookies from "js-cookie";

import {
  userLogin as loginAction,
  userLogout as logoutAction
} from "./redux/actions";

const userLoginFn = async (userData, dispatch) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/user/login`,
      userData
    );

    if (res.data.success) {
      const { token, exp } = res.data;
      const expirationDate = new Date(exp);
      document.cookie = `bocchi=${token}; expires=${expirationDate};path=/;`;
      axios.defaults.headers.common["Authorization"] = token;
      // redux dispatch
      dispatch(loginAction(res.data.user));
      return {
        success: res.data.success,
        message: res.data.message
      };
    }
  } catch (error) {
    if (error.response) {
      Cookies.remove("bocchi");
      dispatch(logoutAction());
      return {
        success: error.response.data.success,
        message: error.response.data.message
      };
    } else {
      return {
        success: false,
        message: error.message
      };
    }
  }
};

export default userLoginFn;

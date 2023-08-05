const initialState = {
  isDataLoading: true,
  isLoggedIn: false,
  userData: null
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        isDataLoading: false,
        isLoggedIn: true,
        userData: action.payload
      };
    case "USER_LOGOUT":
      return {
        initialState,
        isDataLoading: false
      };
    default:
      return state;
  }
};

export default userReducers;

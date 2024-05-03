import { createSlice, configureStore } from "@reduxjs/toolkit";

const globalDataSlice = createSlice({
  name: "globalData",
  initialState: {
    isLoading: false,
    isCheckingLogin: true,
    userInfo: null,
    isDataNeedRefresh: false
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsCheckingLogin: (state, action) => {
      state.isCheckingLogin = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setIsDataNeedRefresh: (state, action) => {
      state.isDataNeedRefresh = action.payload;
    }
  }
});

export const {
  setUserInfo,
  setIsLoading,
  setIsCheckingLogin,
  setIsDataNeedRefresh
} = globalDataSlice.actions;

const globalReducer = globalDataSlice.reducer;

export const selectUserInfo = (state) => state.globalData.userInfo;
export const selectIsLoading = (state) => state.globalData.isLoading;
export const selectIsCheckingLogin = (state) =>
  state.globalData.isCheckingLogin;
export const selectIsDataNeedRefresh = (state) =>
  state.globalData.isDataNeedRefresh;

const store = configureStore({
  reducer: {
    globalData: globalReducer
  }
});

export default store;

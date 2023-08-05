import { combineReducers } from "redux";
// reducers
import userReducers from "./userReducer";
import dataReducer from "./dataReducer";
import loading from "./loadingReducer";
const allReducers = combineReducers({
  user: userReducers,
  data: dataReducer,
  loadStatus: loading
});

export default allReducers;

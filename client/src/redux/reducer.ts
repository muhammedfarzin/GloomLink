import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth";
import themeReducer from "./reducers/theme";

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
});

export default rootReducer;

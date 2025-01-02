import { combineReducers } from '@reduxjs/toolkit';
import themeReducer from './reducers/theme';

const rootReducer = combineReducers({
  theme: themeReducer,
});

export default rootReducer;
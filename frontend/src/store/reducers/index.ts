import { combineReducers } from "redux";
import uiReducer from "./ui.reducer";
import authReducer from "./auth.reducer";

const reducers = combineReducers({
  ui: uiReducer,
  auth: authReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;

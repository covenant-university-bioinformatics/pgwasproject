import { combineReducers } from "redux";
import uiReducer from "./ui.reducer";
import authReducer from "./auth.reducer";
import annotReducer from "./annot.reducer";
const reducers = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  annot: annotReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;

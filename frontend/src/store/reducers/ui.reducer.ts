import { ActionType } from "../action-types";
import { UIAction } from "../actions/ui.action";

interface UIState {
  miniSidebar: boolean;
}

const initialState = {
  miniSidebar: false,
};

const uiReducer = (
  state: UIState = initialState,
  action: UIAction
): UIState => {
  switch (action.type) {
    case ActionType.MINIFIED_LAYOUT:
      return {
        ...state,
        miniSidebar: action.payload,
      };
    default:
      return state;
  }
};

export default uiReducer;

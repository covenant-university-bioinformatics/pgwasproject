import { ActionType } from "../action-types";
import { UIAction } from "../actions/ui.action";
import { Dispatch } from "redux";

export const setMini = (minified: boolean) => {
  return async (dispatch: Dispatch<UIAction>) => {
    dispatch({
      type: ActionType.MINIFIED_LAYOUT,
      payload: minified,
    });
  };
};

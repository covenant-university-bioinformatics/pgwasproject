import { ActionType } from "../action-types";

interface SetMinifiedAction {
  type: ActionType.MINIFIED_LAYOUT;
  payload: boolean;
}

export type UIAction = SetMinifiedAction;

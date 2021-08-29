import { ActionType } from "../action-types";
import { User } from "../reducers/auth.reducer";

export type AuthAction =
  | AuthStartAction
  | AuthSuccessAction
  | AuthErrorAction
  | SignupStartAction
  | SignupSuccessAction
  | SignupErrorAction
  | SignOutStartAction
  | SignOutSuccessAction
  | SignOutErrorAction
  | CurrentUserStartAction
  | CurrentUserSuccessAction
  | CurrentUserErrorAction;

interface AuthStartAction {
  type: ActionType.AUTH_START;
}

interface AuthSuccessAction {
  type: ActionType.AUTH_SUCCESS;
  payload: User;
}

interface AuthErrorAction {
  type: ActionType.AUTH_ERROR;
  payload: string;
}

interface SignupStartAction {
  type: ActionType.SIGNUP_START;
}

interface SignupSuccessAction {
  type: ActionType.SIGNUP_SUCCESS;
}

interface SignupErrorAction {
  type: ActionType.SIGNUP_ERROR;
  payload: string;
}

interface SignOutStartAction {
  type: ActionType.SIGNOUT_START;
}

interface SignOutSuccessAction {
  type: ActionType.SIGNOUT_SUCCESS;
}

interface SignOutErrorAction {
  type: ActionType.SIGNOUT_ERROR;
  payload: string;
}

interface CurrentUserStartAction {
  type: ActionType.CURRENT_USER_START;
}

interface CurrentUserSuccessAction {
  type: ActionType.CURRENT_USER_SUCCESS;
  payload: User;
}

interface CurrentUserErrorAction {
  type: ActionType.CURRENT_USER_ERROR;
  payload: string;
}

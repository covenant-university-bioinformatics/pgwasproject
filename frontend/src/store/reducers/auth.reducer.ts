import { ActionType } from "../action-types";
import { AuthAction } from "../actions/auth.action";

export type User = {
  username: string | null;
  email: string | null;
  emailConfirmed: boolean;
  role: string | null;
};

interface AuthState {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  success: boolean;
  user: User;
}

const initialState = {
  loading: false,
  error: null,
  accessToken: null,
  success: false,
  user: {
    username: null,
    email: null,
    emailConfirmed: false,
    role: null,
  },
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case ActionType.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
        accessToken: null,
        success: false,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
      };
    case ActionType.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: {
          username: action.payload.username,
          email: null,
          emailConfirmed: false,
          role: null,
        },
        accessToken: action.payload.accessToken,
        success: true,
      };
    case ActionType.AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
        accessToken: null,
        success: false,
      };
    case ActionType.SIGNUP_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case ActionType.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
      };
    case ActionType.SIGNUP_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case ActionType.SIGNOUT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case ActionType.SIGNOUT_START:
      return {
        ...state,
        loading: true,
        error: null,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
        accessToken: null,
        success: false,
      };
    case ActionType.SIGNOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
        accessToken: null,
        success: true,
      };
    case ActionType.CURRENT_USER_START:
      return {
        ...state,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
      };
    case ActionType.CURRENT_USER_SUCCESS:
      return {
        ...state,
        user: {
          username: action.payload.username,
          email: action.payload.email,
          emailConfirmed: action.payload.emailConfirmed,
          role: action.payload.role,
        },
      };
    case ActionType.CURRENT_USER_ERROR:
      return {
        ...state,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
      };
    default:
      return state;
  }
};

export default authReducer;

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
  success: boolean;
  user: User;
}

const initialState = {
  loading: false,
  error: null,
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
        success: false,
        user: {
          username: null,
          email: null,
          emailConfirmed: false,
          role: null,
        },
      };
    case ActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case ActionType.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: {
          username: action.payload.username,
          email: action.payload.email,
          emailConfirmed: action.payload.emailConfirmed,
          role: action.payload.role,
        },
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
        success: true,
      };
    case ActionType.CURRENT_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
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
        loading: false,
        error: null,
        success: true,
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
        loading: false,
        error: null,
        success: false,
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

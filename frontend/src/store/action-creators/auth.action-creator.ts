import axios from "../../axios-fetches";
import { ActionType } from "../action-types";
import { AuthAction } from "../actions/auth.action";
import { Dispatch } from "redux";

export const signupUser = (user: {
  username: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({
      type: ActionType.SIGNUP_START,
    });

    try {
      await axios.post("/auth/register", user);
      dispatch({
        type: ActionType.SIGNUP_SUCCESS,
      });
    } catch (error) {
      let message = "";
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join("\n");
      } else {
        message = error.response.data.message;
      }
      dispatch({
        type: ActionType.SIGNUP_ERROR,
        payload: message,
      });
    }
  };
};

export const signinUser = (user: { username: string; password: string }) => {
  return async (dispacth: Dispatch<AuthAction>) => {
    dispacth({
      type: ActionType.AUTH_START,
    });
    try {
      const { data } = await axios.post("/auth/signin", user);
      localStorage.setItem("token", data.accessToken);
      console.log(data);
      dispacth({
        type: ActionType.AUTH_SUCCESS,
        payload: { username: user.username, accessToken: data.accessToken },
      });
    } catch (error) {
      let message = "";
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join("\n");
      } else {
        message = error.response.data.message;
      }
      dispacth({
        type: ActionType.AUTH_ERROR,
        payload: message,
      });
    }
  };
};

export const getCurrentUser = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({
      type: ActionType.CURRENT_USER_START,
    });

    try {
      const response = await axios.get("/users/currentuser");
      dispatch({
        type: ActionType.CURRENT_USER_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log(error.response.data);
      let message = "";
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join("\n");
      } else {
        message = error.response.data.message;
      }
      dispatch({
        type: ActionType.CURRENT_USER_ERROR,
        payload: message,
      });
    }
  };
};

export const signOut = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({
      type: ActionType.SIGNOUT_START,
    });

    try {
      await axios.get("/auth/logout");
      dispatch({
        type: ActionType.SIGNOUT_SUCCESS,
      });
    } catch (error) {
      let message = "";
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join("\n");
      } else {
        message = error.response.data.message;
      }
      dispatch({
        type: ActionType.SIGNOUT_ERROR,
        payload: message,
      });
    }
  };
};

// export const signOut = () => {
//   return async (dispatch: Dispatch<AuthAction>) => {
//     localStorage.removeItem("accessToken");
//     dispatch({
//       type: ActionType.SIGNOUT,
//     });
//   };
// };

//Helper functions
function delete_cookie(name: string, path: string, domain: string) {
  if (get_cookie(name)) {
    document.cookie =
      name +
      "=" +
      (path ? ";path=" + path : "") +
      (domain ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

function get_cookie(name: string) {
  return document.cookie.split(";").some((c) => {
    return c.trim().startsWith(name + "=");
  });
}

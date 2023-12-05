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
    } catch (error: any) {
      let message = "Registration Failed";
      if (error?.response) {
        if (Array.isArray(error.response.data?.message)) {
          message = error.response.data.message.join("\n");
        } else {
          message = error?.response.data?.message;
        }
      }
      if (!message) {
        message = "Something went wrong, Please try again";
      }

      dispatch({
        type: ActionType.SIGNUP_ERROR,
        payload: message,
      });
    }
  };
};

export const signinUser = (user: { credential: string; password: string }) => {
  return async (dispacth: Dispatch<AuthAction>) => {
    dispacth({
      type: ActionType.AUTH_START,
    });
    try {
      const { data } = await axios.post("/auth/signin", user);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.user.username,
          email: data.user.email,
          expiresIn: data.expiresIn,
          role: data.user.role,
          emailConfirmed: data.user.emailConfirmed,
          accessToken: data.accessToken,
        })
      );
      dispacth({
        type: ActionType.AUTH_SUCCESS,
        payload: data.user,
      });
    } catch (error: any) {
      // console.dir(error);
      let message = "Sign In Failed";
      if (error?.response) {
        if (Array.isArray(error.response.data?.message)) {
          message = error.response.data.message.join("\n");
        } else if (error?.response.data?.message) {
          message = error?.response.data?.message;
        } // else {
        //   message = error.response?.data;
        // }
      }

      if (!message) {
        message = "Sign In Failed";
      }

      dispacth({
        type: ActionType.AUTH_ERROR,
        payload: message,
      });
    }
  };
};

//Auto sign in on reload
export const authCheckState = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    // Get token userId, and exp date from local storage
    //to update to indexed db later
    let authuser = localStorage.getItem("user");

    if (!authuser) {
      signOut();
    } else {
      const { expiresIn, emailConfirmed, username, role, email } =
        JSON.parse(authuser);

      const expirationDate = new Date(expiresIn);
      if (expirationDate < new Date()) {
        signOut();
      } else {
        dispatch({
          type: ActionType.AUTH_SUCCESS,
          payload: {
            emailConfirmed,
            username,
            role,
            email,
          },
        });
        setTimeout(() => {
          signOut();
        }, expirationDate.getMilliseconds());
      }
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
    } catch (error: any) {
      console.log(error?.response?.data);
      let message = "Unable to connect";
      if (error?.response) {
        if (Array.isArray(error.response.data?.message)) {
          message = error.response.data.message.join("\n");
        } else {
          message = error?.response.data?.message;
        }
      }
      if (!message) {
        message = "Something went wrong, Please try again";
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
      localStorage.removeItem("user");
    } catch (error: any) {
      let message = "Sign out Failed";
      if (error?.response) {
        if (Array.isArray(error.response.data?.message)) {
          message = error.response.data.message.join("\n");
        } else {
          message = error?.response.data?.message;
        }
      }
      if (!message) {
        message = "Something went wrong, Please try again";
      }
      dispatch({
        type: ActionType.SIGNOUT_ERROR,
        payload: message,
      });
    }
  };
};

export const clearError = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({
      type: ActionType.CLEAR_ERROR,
    });
  };
};

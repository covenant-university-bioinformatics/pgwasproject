import React from "react";
import { Redirect } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";

const AuthGuard = (Component: any) => {
  const { user } = useTypedSelector((state) => state.auth);

  class AuthHoc extends React.Component {
    authCheck = () => {
      if (user.username) {
        return <Component {...this.props} />;
      } else {
        return <Redirect to={"/sign_in"} />;
      }
    };

    render() {
      return this.authCheck();
    }
  }

  return AuthHoc;
};

export default AuthGuard;

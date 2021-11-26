import React from "react";
import { Redirect } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";

const AuthGuard = (Component: any, routeProps?: any) => {
  const { user } = useTypedSelector((state) => state.auth);
  class AuthHoc extends React.Component {
    authCheck = () => {
      if (user.username) {
        return <Component {...routeProps} />;
      } else {
        return (
          <Redirect
            to={{
              pathname: "/sign_in",
              // @ts-ignore
              state: { referrer: this.props.location.pathname },
            }}
          />
        );
      }
    };

    render() {
      return this.authCheck();
    }
  }

  return AuthHoc;
};

export default AuthGuard;

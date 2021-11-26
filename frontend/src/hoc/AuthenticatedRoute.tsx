import React from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { Redirect, RouteComponentProps } from "react-router-dom";

type Props = {
  Component: any;
};

const AuthenticatedRoute: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  let userRoute;
  if (user.username) {
    userRoute = (
      <props.Component
        history={props.history}
        location={props.location}
        match={props.match}
      />
    );
  } else {
    userRoute = (
      <Redirect
        to={{
          pathname: "/sign_in",
          // @ts-ignore
          state: { referrer: props.location.pathname },
        }}
      />
    );
  }
  return userRoute;
};

export default AuthenticatedRoute;

import React, { useState } from "react";
import pgwasAxios from "../../axios-fetches";
import MainLayout from "../MainLayout";
import classes from "./index.module.scss";
import { AppBar, Button, Hidden, Toolbar } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import {
  AddBoxRounded,
  HomeRounded,
  TableChartRounded,
} from "@material-ui/icons";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import {
  showToastError,
  showToastSuccess,
} from "../../components/utility/general_utils";

type Props = {
  title: string;
  path: string;
};

const ToolsLayout: React.FC<Props> = ({ title, path, children }) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [showButton, setShowButton] = useState(true);
  const resendConfirm = () => {
    pgwasAxios
      .get("/auth/resendconfirm")
      .then((res) => {
        showToastSuccess("Verification email sent");
        setShowButton(false);
      })
      .catch((error) => {
        setShowButton(true);
        showToastError("Could not send email, please try again");
      });
  };
  return (
    <MainLayout title={title}>
      {user.username ? (
        !user.emailConfirmed ? (
          <div className={classes.email_confirmed}>
            <div className={classes.main}>
              Please you have to verify your email first before you can use any
              service. Please check "{user.email}" for the verification email.{" "}
              {showButton && (
                <p>
                  If you did not get the email please click{" "}
                  <button onClick={resendConfirm}>here</button> to resend
                  confirmation.
                </p>
              )}
            </div>
            <div className={classes.sub}>Please confirm email</div>
          </div>
        ) : null
      ) : (
        <div className={classes.email_confirmed}>
          <div className={classes.main}>
            Sign UP/Sign IN is not compulsory, but it helps us to keep an
            history of your new jobs and also send emails about the status of
            your jobs. Please Sign in
          </div>
          <div className={classes.sub}>Please Sign IN</div>
        </div>
      )}
      <div className={classes.tool_appbar}>
        {/*<AppBar color={"primary"} position="static" className={classes.appBar}>*/}
        {/*  <Toolbar variant="dense" className={classes.toolBar}>*/}
        <NavLink
          to={path}
          className={classes.links}
          activeClassName={classes.selected}
          exact
        >
          <Button startIcon={<HomeRounded />} size="medium" color="inherit">
            <Hidden xsDown>Index</Hidden>
          </Button>
        </NavLink>
        <NavLink
          activeClassName={classes.selected}
          to={path + "/form"}
          className={classes.links}
          exact
        >
          <Button startIcon={<AddBoxRounded />} size="medium" color="inherit">
            <Hidden xsDown>New Analysis</Hidden>
          </Button>
        </NavLink>
        <NavLink
          activeClassName={classes.selected}
          to={path + "/all_results"}
          className={classes.links}
          exact
        >
          <Button
            startIcon={<TableChartRounded />}
            size="medium"
            color="inherit"
          >
            <Hidden xsDown>Results (History)</Hidden>
          </Button>
        </NavLink>
        {/*</Toolbar>*/}
        {/*</AppBar>*/}
      </div>
      {children}
    </MainLayout>
  );
};

export default ToolsLayout;

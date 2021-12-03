import React from "react";
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

type Props = {
  title: string;
  path: string;
};

const ToolsLayout: React.FC<Props> = ({ title, path, children }) => {
  const { user } = useTypedSelector((state) => state.auth);
  return (
    <MainLayout title={title}>
      {user.username ? (
        !user.emailConfirmed ? (
          <div className={classes.email_confirmed}>
            <div className={classes.main}>
              Please you have to verify your email first before you can use any
              service. Please check this "{user.email}" for the verification
              email
            </div>
            <div className={classes.sub}>Please confirm email</div>
          </div>
        ) : null
      ) : (
        <div className={classes.email_confirmed}>
          <div className={classes.main}>
            Sign UP/Sign IN is not required, but it helps us to keep an history
            of your new jobs and also send emails about the status of your jobs.
            Please Sign in
          </div>
          <div className={classes.sub}>Please Sign IN</div>
        </div>
      )}
      <div className={classes.tool_appbar}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar variant="dense" className={classes.toolBar}>
            <NavLink
              to={path}
              className={classes.links}
              activeClassName={classes.selected}
              exact
            >
              <Button startIcon={<HomeRounded />} size="medium" color="inherit">
                <Hidden xsDown>Home</Hidden>
              </Button>
            </NavLink>
            <NavLink
              activeClassName={classes.selected}
              to={path + "/form"}
              className={classes.links}
              exact
            >
              <Button
                startIcon={<AddBoxRounded />}
                size="medium"
                color="inherit"
              >
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
          </Toolbar>
        </AppBar>
        {children}
      </div>
    </MainLayout>
  );
};

export default ToolsLayout;

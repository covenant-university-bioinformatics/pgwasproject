import React from "react";
import { AppBar, Toolbar, Button, Hidden } from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";
import classes from "./index.module.scss";
import {
  PersonAddRounded,
  AppsRounded,
  InputRounded,
  MenuBookRounded,
  DashboardRounded,
} from "@material-ui/icons";

type Props = {};

const Header: React.FC<Props> = (props) => {
  return (
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logo_donut}>
          <div className={classes.logoContainer}>
            <div className={classes.Logo}>
              <Link to={"/"}>
                Sysbiol<span>PGWAS</span>
              </Link>
            </div>
          </div>
        </div>
        <nav className={classes.links}>
          <NavLink to="/tutorials">
            <Button
              startIcon={<MenuBookRounded />}
              size="medium"
              color="inherit"
            >
              <Hidden smDown> Tutorials </Hidden>
            </Button>
          </NavLink>
          <NavLink to="/">
            <Button startIcon={<AppsRounded />} size="medium" color="inherit">
              <Hidden smDown> Tools </Hidden>
            </Button>
          </NavLink>
          <NavLink to="/workflows">
            <Button
              startIcon={<DashboardRounded />}
              size="medium"
              color="inherit"
            >
              <Hidden smDown> Workflow </Hidden>
            </Button>
          </NavLink>
          <NavLink to="/sign_up">
            <Button
              startIcon={<PersonAddRounded />}
              size="medium"
              color="inherit"
            >
              <Hidden smDown> Sign Up </Hidden>
            </Button>
          </NavLink>
          <NavLink to="/sign_in">
            <Button startIcon={<InputRounded />} size="medium" color="inherit">
              <Hidden smDown> Sign In </Hidden>
            </Button>
          </NavLink>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

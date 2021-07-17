import React from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";
import classes from "./index.module.scss";

type Props = {};

const Header: React.FC<Props> = (props) => {
  return (
    <AppBar position="fixed" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoContainer}>
          <div className={classes.Logo}>
            <Link to={"/"}>
              Sysbiol<span>PGWAS</span>
            </Link>
          </div>
        </div>
        <nav className={classes.links}>
          <NavLink to="/tutorials">
            <Button size="medium" color="inherit">
              Tutorials
            </Button>
          </NavLink>
          <NavLink to="/dashboard">
            <Button size="medium" color="inherit">
              Dashboard
            </Button>
          </NavLink>
          <NavLink to="/sign_up">
            <Button size="medium" color="inherit">
              Sign Up
            </Button>
          </NavLink>
          <NavLink to="/sign_in">
            <Button size="medium" color="inherit">
              Sign In
            </Button>
          </NavLink>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

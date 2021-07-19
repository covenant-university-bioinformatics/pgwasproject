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

type Props = {
  title: string;
  path: string;
};

const ToolsLayout: React.FC<Props> = ({ title, path, children }) => {
  return (
    <MainLayout title={title}>
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
                <Hidden xsDown>Results</Hidden>
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

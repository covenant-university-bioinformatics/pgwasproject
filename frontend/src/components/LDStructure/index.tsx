import React from "react";
import MainLayout from "../../layouts/MainLayout";
import classes from "./index.module.scss";
import { AppBar, Button, Toolbar } from "@material-ui/core";
import {
  HomeRounded,
  TableChartRounded,
  AddBoxRounded,
} from "@material-ui/icons";
import { NavLink, Route, RouteComponentProps, Switch } from "react-router-dom";
import LDStructureHome from "./Home";
import LdStructureForm from "./Form";

type Props = {};

const LDStructure: React.FC<Props & RouteComponentProps> = (props) => {
  console.log(props.match.url);

  return (
    <MainLayout title={"LD Structure"}>
      <div className={classes.ldstructure}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar variant="dense" className={classes.toolBar}>
            <NavLink
              to={props.match.url}
              className={classes.links}
              activeClassName={classes.selected}
              exact
            >
              <Button startIcon={<HomeRounded />} size="medium" color="inherit">
                Home
              </Button>
            </NavLink>
            <NavLink
              activeClassName={classes.selected}
              to={props.match.url + "/form"}
              className={classes.links}
              exact
            >
              <Button
                startIcon={<AddBoxRounded />}
                size="medium"
                color="inherit"
              >
                New Analysis
              </Button>
            </NavLink>
            <NavLink
              activeClassName={classes.selected}
              to={props.match.url + "/all_results"}
              className={classes.links}
              exact
            >
              <Button
                startIcon={<TableChartRounded />}
                size="medium"
                color="inherit"
              >
                Results
              </Button>
            </NavLink>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route exact path={props.match.url} component={LDStructureHome} />
          <Route path={props.match.url + "/form"} component={LdStructureForm} />
          <Route exact path={props.match.url + "/all_results"} />
          <Route exact path={props.match.url + "/result_view"} />
        </Switch>
      </div>
    </MainLayout>
  );
};

export default LDStructure;

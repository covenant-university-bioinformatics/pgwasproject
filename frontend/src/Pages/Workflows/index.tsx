import React, { useEffect } from "react";
import Divider from "@mui/material/Divider";
import { NavLink, Route, RouteComponentProps, Switch } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TableViewIcon from "@mui/icons-material/TableView";
import HomeIcon from "@mui/icons-material/Home";
import Toolbar from "@mui/material/Toolbar";
import classes from "./index.module.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Backdrop from "../../components/Backdrop";
import WorkflowForm from "../../components/WorkflowForm";
import WorkflowResultList from "../../components/WorkflowResultList";
import WorkflowResultView from "../../components/WorkflowResultView";
import WorkflowHome from "../../components/WorkflowHome";

type Props = {};

const Workflows: React.FC<Props & RouteComponentProps> = (props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const sideBarClass = [classes.sidebar_nav];
  if (mobileOpen) {
    sideBarClass.push(classes.sidebar_open);
  }

  const drawer = (
    <div className={classes.drawer}>
      <Toolbar />
      <Divider />
      <ul>
        <li>
          <NavLink
            activeClassName={classes.selected}
            className={classes.link}
            exact
            to={props.match.url}
            onClick={() => {
              if (mobileOpen) {
                closeDrawer();
              }
            }}
          >
            <HomeIcon />
            <p>Home</p>
          </NavLink>
        </li>
        <Divider />
        <li>
          <NavLink
            activeClassName={classes.selected}
            className={classes.link}
            exact
            to={props.match.url + "/form"}
            onClick={() => {
              if (mobileOpen) {
                closeDrawer();
              }
            }}
          >
            <AddBoxIcon />
            <p>Create New Job</p>
          </NavLink>
        </li>
        <Divider />
        <li>
          <NavLink
            activeClassName={classes.selected}
            className={classes.link}
            exact
            to={props.match.url + "/all_results"}
            onClick={() => {
              if (mobileOpen) {
                closeDrawer();
              }
            }}
          >
            <TableViewIcon />
            <p>View Jobs</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={classes.workflows}>
      <div className={classes.sidebar}>{drawer}</div>
      <div className={sideBarClass.join(" ")}>{drawer}</div>
      <Backdrop mobileOpen={mobileOpen} closeDrawer={closeDrawer} />
      <div className={classes.main_area}>
        <div className={classes.donut}>
          <IconButton
            color="inherit"
            className={classes.donut_icon}
            aria-label="open drawer"
            // edge="start"
            onClick={handleDrawerToggle}
            // sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        {/*<div className={classes.container}>*/}
        <Switch>
          <Route exact path={props.match.url} component={WorkflowHome} />
          <Route
            exact
            path={props.match.url + "/form"}
            component={WorkflowForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={WorkflowResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={WorkflowResultView}
          />
        </Switch>
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Workflows;

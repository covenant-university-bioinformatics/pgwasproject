import React from "react";
import Grid from "@material-ui/core/Grid";
import SideBar from "../../components/SideBar";
import classes from "./index.module.scss";
import { IconButton } from "@material-ui/core";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { Menu } from "@material-ui/icons";
import { useActions } from "../../hooks/useActions";
type Props = {
  title: string;
};

const MainLayout: React.FC<Props> = (props) => {
  const { setMini } = useActions();
  const { miniSidebar } = useTypedSelector((state) => state.ui);
  const sideBarClass = [classes.side_container];
  if (miniSidebar) {
    sideBarClass.push(classes.open);
  }
  return (
    <div className={classes.mainLayout}>
      {/*<Hidden xsDown>*/}
      <Grid container spacing={2} className={classes.grid_container}>
        {/*<Hidden smDown>*/}
        {miniSidebar ? (
          <Grid item xs={12} className={sideBarClass.join(" ")}>
            <SideBar />
          </Grid>
        ) : (
          <Grid item sm={2} md={2} className={sideBarClass.join(" ")}>
            <SideBar />
          </Grid>
        )}
        {/*</Hidden>*/}
        {/*<Hidden smDown>*/}
        {miniSidebar ? null : (
          <Grid item sm={12} md={10} className={classes.main_container}>
            <div>
              <h2 className={classes.main_title}>{props.title}</h2>
              <hr />
              {props.children}
            </div>
          </Grid>
        )}
        {/*</Hidden>*/}
      </Grid>
      {/*<div className={classes.info}>*/}
      {/*  This app is not available for small devices*/}
      {/*</div>*/}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => {
          setMini(!miniSidebar);
        }}
        edge="start"
        className={classes.sidebar_donut}
        // className={clsx(classes.menuButton, open && classes.hide)}
      >
        <Menu />
      </IconButton>
    </div>
  );
};

export default MainLayout;

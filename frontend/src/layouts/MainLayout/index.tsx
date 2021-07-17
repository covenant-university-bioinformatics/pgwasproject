import React from "react";
import Grid from "@material-ui/core/Grid";
import SideBar from "../../components/SideBar";
import classes from "./index.module.scss";
type Props = {
  title: string;
};

const MainLayout: React.FC<Props> = (props) => {
  return (
    <div className={classes.mainLayout}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <SideBar />
        </Grid>
        <Grid item xs={10}>
          <div className={classes.main_container}>
            <h2 className={classes.main_title}>{props.title}</h2>
            <hr />
            {props.children}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainLayout;

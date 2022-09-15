import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const FocusHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.loci2path}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>Text information coming soon</p>
      </Paper>
    </div>
  );
};

export default FocusHome;

import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const ZscoreHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.zscore}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>Zscore analysis tab.</p>
      </Paper>
    </div>
  );
};

export default ZscoreHome;

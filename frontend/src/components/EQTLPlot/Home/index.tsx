import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const EQTLPlot: React.FC<Props> = (props) => {
  return (
    <div className={classes.eqtlplot}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>EQTL Plotting</p>
      </Paper>
    </div>
  );
};

export default EQTLPlot;

import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const AnnotationHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          Genome annotation is the process of identifying functional elements
          along the sequence of a genome, thus giving meaning to it.
        </p>
      </Paper>
    </div>
  );
};

export default AnnotationHome;

import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const LiftoverHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          All the tools provided in this application are based on Genome build
          HG19/GRCH37 This pipeline helps to convert genome coordinates and
          genome annotation files from GRCH38 and GRCH36 to GRCH37.
        </p>
        <p>
          This pipeline uses the UCSC Liftover tool to carry out its operations.
        </p>
      </Paper>
    </div>
  );
};

export default LiftoverHome;

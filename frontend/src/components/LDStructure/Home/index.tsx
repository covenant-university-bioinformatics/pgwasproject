import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const LDStructureHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          In population genetics, linkage disequilibrium (LD) is the non-random
          association of alleles at different loci in a given population. Loci
          are said to be in linkage disequilibrium when the frequency of
          association of their different alleles is higher or lower than what
          would be expected if the loci were independent and associated randomly
        </p>
      </Paper>
    </div>
  );
};

export default LDStructureHome;

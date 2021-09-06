import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const DeleteriousnessHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          Genome Deleteriousness is the process of identifying non synonymous
          SNPS that can cause amino acid changes.
        </p>
        <p>
          This analysis uses Annovar tool and the dbNSFP database that includes
          secereal scores that have been predicted for several SNPs using
          diverse machine learning algorithms.
        </p>
      </Paper>
    </div>
  );
};

export default DeleteriousnessHome;

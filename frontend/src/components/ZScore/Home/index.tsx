import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const ZscoreHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.zscore}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          This pipeline aims to calculate zscore for a given GWAS summary files.
          The essence of this pipeline is that many post GWAS tool require
          zscore field.
        </p>
        <h3>Input</h3>
        <p>
          The input files is a GWAS summary files with beta field and at least
          one of the below two columns:
        </p>
        <ul>
          <li>Standard error</li>
          <li>p value</li>
        </ul>
        <p>
          In case both fields (standard error and p value) are provided, the
          pipeline will consider the standard error field and ignore the p value
          field.
        </p>
        <h3>Output</h3>
        <p>
          The output file will contain all the fields in the input file and
          append a z score field.
        </p>
      </Paper>
    </div>
  );
};

export default ZscoreHome;

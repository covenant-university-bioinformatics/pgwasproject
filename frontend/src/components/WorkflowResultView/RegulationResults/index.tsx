import React from "react";
import classes from "./index.module.scss";

type Props = {};

const RegulationResults: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.regulation}>
      <h1>Regulation Results</h1>
      <div className={classes.content}>
        <p>Coming Soon</p>
      </div>
    </div>
  );
};

export default RegulationResults;

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../utility/ResultList";
import classes from "./index.module.scss";

type Props = {};

const WorkflowResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <div className={classes.result_list}>
      {/*<div className={classes.container}>*/}
      <h1 className={classes.main_header}>List of User Jobs</h1>
      <ResultList
        apiPath={"spgwas"}
        frontendPath={""}
        history={props.history}
        location={props.location}
        match={props.match}
      />
      {/*</div>*/}
    </div>
  );
};

export default WorkflowResultList;

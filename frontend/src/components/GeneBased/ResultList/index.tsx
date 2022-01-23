import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const GeneBasedResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"genebased"}
        frontendPath={"genebased"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default GeneBasedResultList;

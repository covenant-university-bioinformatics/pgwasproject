import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const EnsemblVEPResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"ensemblvep"}
        frontendPath={"ensemblvep"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default EnsemblVEPResultList;

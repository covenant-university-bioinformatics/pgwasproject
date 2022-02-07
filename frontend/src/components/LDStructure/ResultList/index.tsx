import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const LDStructureResultList: React.FC<Props & RouteComponentProps> = (
  props
) => {
  return (
    <>
      <ResultList
        apiPath={"ldstructure"}
        frontendPath={"ldstructure"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default LDStructureResultList;

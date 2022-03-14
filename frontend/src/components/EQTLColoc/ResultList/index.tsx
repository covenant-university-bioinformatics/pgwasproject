import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const EqtlColocResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"eqtlcoloc"}
        frontendPath={"eqtlcoloc"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default EqtlColocResultList;

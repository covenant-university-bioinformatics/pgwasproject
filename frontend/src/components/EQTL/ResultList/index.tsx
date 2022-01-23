import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const EqtlResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"eqtl"}
        frontendPath={"eqtl"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default EqtlResultList;

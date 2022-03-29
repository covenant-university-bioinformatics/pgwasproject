import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const ImputationResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"imputation"}
        frontendPath={"imputation"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default ImputationResultList;

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const ZscoreResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"zscore"}
        frontendPath={"zscore"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default ZscoreResultList;

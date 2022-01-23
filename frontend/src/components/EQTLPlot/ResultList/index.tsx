import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const EqtlPlotResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"eqtlplot"}
        frontendPath={"eqtlplot"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default EqtlPlotResultList;

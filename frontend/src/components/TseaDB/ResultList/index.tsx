import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const FocusResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"tseadb"}
        frontendPath={"tseadb"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default FocusResultList;

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const HaploRResultList: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <>
      <ResultList
        apiPath={"haplor"}
        frontendPath={"regulationhaplor"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default HaploRResultList;

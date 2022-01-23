import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const DeleteriousnessResultList: React.FC<Props & RouteComponentProps> = (
  props
) => {
  return (
    <>
      <ResultList
        apiPath={"delet"}
        frontendPath={"deleteriousness"}
        history={props.history}
        location={props.location}
        match={props.match}
      />
    </>
  );
};

export default DeleteriousnessResultList;

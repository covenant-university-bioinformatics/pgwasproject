import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ResultList from "../../utility/ResultList";

type Props = {};

const Loci2PathResultList: React.FC<Props & RouteComponentProps> = (props) => {
    return (
        <>
            <ResultList
                apiPath={"loci2path"}
                frontendPath={"loci2path"}
                history={props.history}
                location={props.location}
                match={props.match}
            />
        </>
    );
};

export default Loci2PathResultList;
import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import EQTLHome from "./Home";
import EQTLForm from "./Form";
import EQTLResultList from "./ResultList";
import EQTLResultView from "./ResultView";

type Props = {};

const EQTL: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"Expression Qualitative Trait Loci analysis"}
      path={props.match.url}
    >
      <div className={classes.eqtl}>
        <Switch>
          <Route exact path={props.match.url} component={EQTLHome} />
          <Route path={props.match.url + "/form"} component={EQTLForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={EQTLResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={EQTLResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default EQTL;

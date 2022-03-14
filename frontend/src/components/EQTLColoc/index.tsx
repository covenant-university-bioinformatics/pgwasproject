import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import EqtlColocHome from "./Home";
import EqtlColocForm from "./Form";
import EqtlColocResultList from "./ResultList";
import EqtlColocResultView from "./ResultView";

type Props = {};

const EQTLColoc: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"EQTL - Colocalization"} path={props.match.url}>
      <div className={classes.eqtlcoloc_home}>
        <Switch>
          <Route exact path={props.match.url} component={EqtlColocHome} />
          <Route path={props.match.url + "/form"} component={EqtlColocForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={EqtlColocResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={EqtlColocResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default EQTLColoc;

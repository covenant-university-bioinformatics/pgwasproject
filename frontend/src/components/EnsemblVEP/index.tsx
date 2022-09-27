import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import EnsemblVEPHome from "./Home";
import EnsemblVEPForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import EnsemblVEPResultList from "./ResultList";
import EnsemblVEPResultView from "./ResultView";

type Props = {};

const EnsemblVEP: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"CADD Annotation"}
      path={props.match.url}
    >
      <div className={classes.loci2path}>
        <Switch>
          <Route exact path={props.match.url} component={EnsemblVEPHome} />
          <Route exact path={props.match.url + "/form"} component={EnsemblVEPForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={EnsemblVEPResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={EnsemblVEPResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default EnsemblVEP;

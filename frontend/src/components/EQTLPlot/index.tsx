import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import EqtlPlotHome from "./Home";
import EqtlPlotForm from "./Form";
import EqtlPlotResultList from "./ResultList";
import EqtlPlotResultView from "./ResultView";

type Props = {};

const EQTLPlot: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"EQTL SMR Plots"} path={props.match.url}>
      <div className={classes.genebased}>
        <Switch>
          <Route exact path={props.match.url} component={EqtlPlotHome} />
          <Route path={props.match.url + "/form"} component={EqtlPlotForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={EqtlPlotResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={EqtlPlotResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default EQTLPlot;

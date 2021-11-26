import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import PathwayBasedHome from "./Home";
import PathwayBasedForm from "./Form";
import PathwayBasedResultList from "./ResultList";
import PathwayBasedResultView from "./ResultView";

type Props = {};

const PathwayBased: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Pathway Based Analysis"} path={props.match.url}>
      <div className={classes.pathwaybased}>
        <Switch>
          <Route exact path={props.match.url} component={PathwayBasedHome} />
          <Route
            path={props.match.url + "/form"}
            component={PathwayBasedForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={PathwayBasedResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={PathwayBasedResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default PathwayBased;

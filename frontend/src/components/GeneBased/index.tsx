import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import GeneBasedHome from "./Home";
import GeneBasedForm from "./Form";
import GeneBasedResultList from "./ResultList";
import GeneBasedResultView from "./ResultView";

type Props = {};

const GeneBased: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Gene Based Analysis"} path={props.match.url}>
      <div className={classes.genebased}>
        <Switch>
          <Route exact path={props.match.url} component={GeneBasedHome} />
          <Route path={props.match.url + "/form"} component={GeneBasedForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={GeneBasedResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={GeneBasedResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default GeneBased;

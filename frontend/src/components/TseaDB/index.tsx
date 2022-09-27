import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import TseaDBHome from "./Home";
import TseaDBForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import TseaDBResultList from "./ResultList";
import TseaDBResultView from "./ResultView";

type Props = {};

const TseaDB: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"Tissue Specific Enrichment Analysis"}
      path={props.match.url}
    >
      <div className={classes.tseadb}>
        <Switch>
          <Route exact path={props.match.url} component={TseaDBHome} />
          <Route
            exact
            path={props.match.url + "/form"}
            component={TseaDBForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={TseaDBResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={TseaDBResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default TseaDB;

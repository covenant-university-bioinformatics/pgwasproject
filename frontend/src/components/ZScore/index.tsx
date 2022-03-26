import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import ZscoreHome from "./Home";
import ZscoreForm from "./Form";
import ZscoreResultList from "./ResultList";
import ZscoreResultView from "./ResultView";

type Props = {};

const Zscore: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Zscore Analysis"} path={props.match.url}>
      <div className={classes.zscore_home}>
        <Switch>
          <Route exact path={props.match.url} component={ZscoreHome} />
          <Route path={props.match.url + "/form"} component={ZscoreForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={ZscoreResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={ZscoreResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Zscore;

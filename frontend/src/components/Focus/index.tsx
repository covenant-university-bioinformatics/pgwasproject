import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import FocusHome from "./Home";
import FocusForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import FocusResultList from "./ResultList";
import FocusResultView from "./ResultView";

type Props = {};

const Focus: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"Probabilistic FineMapping (FOCUS)"}
      path={props.match.url}
    >
      <div className={classes.focus}>
        <Switch>
          <Route exact path={props.match.url} component={FocusHome} />
          <Route exact path={props.match.url + "/form"} component={FocusForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={FocusResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={FocusResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Focus;

import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import DivanHome from "./Home";
import DivanForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import DivanResultList from "./ResultList";
import DivanResultView from "./ResultView";

type Props = {};

const Divan: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"DIVAN (Disease-specific Variant ANnotation)"}
      path={props.match.url}
    >
      <div className={classes.focus}>
        <Switch>
          <Route exact path={props.match.url} component={DivanHome} />
          <Route exact path={props.match.url + "/form"} component={DivanForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={DivanResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={DivanResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Divan;

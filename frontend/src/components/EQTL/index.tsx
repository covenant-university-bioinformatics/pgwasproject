import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import EqtlHome from "./Home";
import EqtlForm from "./Form";
import EqtlResultList from "./ResultList";
import EqtlResultView from "./ResultView";

type Props = {};

const EQTL: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"EQTL - SMR/HEIDI"} path={props.match.url}>
      <div className={classes.eqtl_home}>
        <Switch>
          <Route exact path={props.match.url} component={EqtlHome} />
          <Route path={props.match.url + "/form"} component={EqtlForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={EqtlResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={EqtlResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default EQTL;

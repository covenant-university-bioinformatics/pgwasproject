import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import ImputationHome from "./Home";
import ImputationForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import ImputationResultList from "./ResultList";
import ImputationResultView from "./ResultView";

type Props = {};

const Imputation: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"Imputation from Summary Statistics"}
      path={props.match.url}
    >
      <div className={classes.imputation}>
        <Switch>
          <Route exact path={props.match.url} component={ImputationHome} />
          <Route
            exact
            path={props.match.url + "/form"}
            component={ImputationForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={ImputationResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={ImputationResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Imputation;

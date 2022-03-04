import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import RegHaploRHome from "./Home";
import RegHaploRForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import RegHaploRResultList from "./ResultList";
import RegHaploRResultView from "./ResultView";

type Props = {};

const RegHaploR: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Regulation (HaploR)"} path={props.match.url}>
      <div className={classes.ldstructure}>
        <Switch>
          <Route exact path={props.match.url} component={RegHaploRHome} />
          <Route
            exact
            path={props.match.url + "/form"}
            component={RegHaploRForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={RegHaploRResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={RegHaploRResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default RegHaploR;

import React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import classes from "../LDStructure/index.module.scss";
import ToolsLayout from "../../layouts/ToolsLayout";
import LiftoverHome from "./Home";
import LiftoverForm from "./Form";
import LiftoverResultList from "./ResultList";

type Props = {};

const Index: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Liftover"} path={props.match.url}>
      <div className={classes.liftover}>
        <Switch>
          <Route exact path={props.match.url} component={LiftoverHome} />
          <Route path={props.match.url + "/form"} component={LiftoverForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={LiftoverResultList}
          />
          <Route exact path={props.match.url + "/result_view"} />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Index;

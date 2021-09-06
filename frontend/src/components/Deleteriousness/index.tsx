import React from "react";
import ToolsLayout from "../../layouts/ToolsLayout";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import DeleteriousnessHome from "./Home";
import DeleteriousnessForm from "./Form";
import DeleteriousnessResultList from "./ResultList";
import DeleteriousnessResultView from "./ResultView";

type Props = {};

const Deleteriousness: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Deleteriousness"} path={props.match.url}>
      <div className={classes.delet}>
        <Switch>
          <Route exact path={props.match.url} component={DeleteriousnessHome} />
          <Route
            path={props.match.url + "/form"}
            component={DeleteriousnessForm}
          />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={DeleteriousnessResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={DeleteriousnessResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Deleteriousness;
